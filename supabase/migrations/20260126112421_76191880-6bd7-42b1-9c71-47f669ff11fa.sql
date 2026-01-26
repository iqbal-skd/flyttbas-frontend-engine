-- Drop the old function first since we're changing its return type
DROP FUNCTION IF EXISTS public.get_partner_commission_rate(uuid);

-- Create new function that returns both rate and type
CREATE OR REPLACE FUNCTION public.get_partner_commission_rate(partner_uuid uuid)
RETURNS TABLE(rate numeric, commission_type text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    partner_rate NUMERIC;
    partner_type TEXT;
    system_rate NUMERIC;
    system_type TEXT;
    system_value JSONB;
BEGIN
    -- Get partner's custom rate and type
    SELECT commission_rate_override, commission_type_override 
    INTO partner_rate, partner_type
    FROM public.partners
    WHERE id = partner_uuid;

    -- Get system settings (stored as JSON with rate and type)
    SELECT value INTO system_value
    FROM public.system_settings
    WHERE key = 'commission_rate';

    -- Parse system settings
    IF system_value IS NOT NULL THEN
        -- Handle both old format (number) and new format (JSON object)
        IF jsonb_typeof(system_value) = 'object' THEN
            system_rate := (system_value->>'rate')::numeric;
            system_type := COALESCE(system_value->>'type', 'percentage');
        ELSE
            system_rate := (system_value::text)::numeric;
            system_type := 'percentage';
        END IF;
    ELSE
        system_rate := 7;
        system_type := 'percentage';
    END IF;

    -- Return partner override if set, otherwise system defaults
    rate := COALESCE(partner_rate, system_rate);
    commission_type := COALESCE(partner_type, system_type);
    
    RETURN NEXT;
END;
$function$;

-- Update create_commission_fee trigger function
CREATE OR REPLACE FUNCTION public.create_commission_fee()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    commission_rate NUMERIC(10,2);
    comm_type TEXT;
    partner_rate NUMERIC(10,2);
    partner_type TEXT;
    system_rate NUMERIC(10,2);
    system_type TEXT;
    system_value JSONB;
    calculated_fee NUMERIC(10,2);
BEGIN
    -- Only create fee when offer is first approved
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        -- Get partner-specific override if exists
        SELECT commission_rate_override, commission_type_override 
        INTO partner_rate, partner_type
        FROM public.partners
        WHERE id = NEW.partner_id;

        -- Get system settings
        SELECT value INTO system_value
        FROM public.system_settings
        WHERE key = 'commission_rate';

        -- Parse system settings (handle both old and new format)
        IF system_value IS NOT NULL THEN
            IF jsonb_typeof(system_value) = 'object' THEN
                system_rate := (system_value->>'rate')::numeric;
                system_type := COALESCE(system_value->>'type', 'percentage');
            ELSE
                system_rate := (system_value::text)::numeric;
                system_type := 'percentage';
            END IF;
        ELSE
            system_rate := 7;
            system_type := 'percentage';
        END IF;

        -- Use partner override if set, otherwise system rate
        commission_rate := COALESCE(partner_rate, system_rate);
        comm_type := COALESCE(partner_type, system_type);

        -- Calculate fee based on type
        IF comm_type = 'fixed' THEN
            calculated_fee := commission_rate;
        ELSE
            calculated_fee := FLOOR(NEW.price_before_rut * (commission_rate / 100));
        END IF;

        -- Insert the commission fee
        INSERT INTO public.commission_fees (
            offer_id,
            partner_id,
            order_value,
            fee_percentage,
            fee_amount
        )
        VALUES (
            NEW.id,
            NEW.partner_id,
            NEW.price_before_rut,
            CASE WHEN comm_type = 'percentage' THEN commission_rate / 100 ELSE NULL END,
            calculated_fee
        );
    END IF;

    RETURN NEW;
END;
$function$;

-- Update create_commission_fee_on_insert trigger function
CREATE OR REPLACE FUNCTION public.create_commission_fee_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    commission_rate NUMERIC(10,2);
    comm_type TEXT;
    partner_rate NUMERIC(10,2);
    partner_type TEXT;
    system_rate NUMERIC(10,2);
    system_type TEXT;
    system_value JSONB;
    calculated_fee NUMERIC(10,2);
BEGIN
    -- Only create fee if inserted as approved
    IF NEW.status = 'approved' THEN
        -- Get partner-specific override if exists
        SELECT commission_rate_override, commission_type_override 
        INTO partner_rate, partner_type
        FROM public.partners
        WHERE id = NEW.partner_id;

        -- Get system settings
        SELECT value INTO system_value
        FROM public.system_settings
        WHERE key = 'commission_rate';

        -- Parse system settings
        IF system_value IS NOT NULL THEN
            IF jsonb_typeof(system_value) = 'object' THEN
                system_rate := (system_value->>'rate')::numeric;
                system_type := COALESCE(system_value->>'type', 'percentage');
            ELSE
                system_rate := (system_value::text)::numeric;
                system_type := 'percentage';
            END IF;
        ELSE
            system_rate := 7;
            system_type := 'percentage';
        END IF;

        -- Use partner override if set, otherwise system rate
        commission_rate := COALESCE(partner_rate, system_rate);
        comm_type := COALESCE(partner_type, system_type);

        -- Calculate fee based on type
        IF comm_type = 'fixed' THEN
            calculated_fee := commission_rate;
        ELSE
            calculated_fee := FLOOR(NEW.price_before_rut * (commission_rate / 100));
        END IF;

        -- Insert the commission fee
        INSERT INTO public.commission_fees (
            offer_id,
            partner_id,
            order_value,
            fee_percentage,
            fee_amount
        )
        VALUES (
            NEW.id,
            NEW.partner_id,
            NEW.price_before_rut,
            CASE WHEN comm_type = 'percentage' THEN commission_rate / 100 ELSE NULL END,
            calculated_fee
        );
    END IF;

    RETURN NEW;
END;
$function$;