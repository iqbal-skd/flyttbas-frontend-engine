-- Fix commission calculation to use system settings and partner overrides
-- Previously hardcoded to 7%, now uses dynamic rate from settings

-- Drop existing trigger
DROP TRIGGER IF EXISTS on_offer_approved ON public.offers;

-- Replace the commission fee creation function
CREATE OR REPLACE FUNCTION public.create_commission_fee()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    commission_rate NUMERIC(5,2);
    partner_override NUMERIC(5,2);
    system_rate NUMERIC(5,2);
BEGIN
    -- Only create fee when offer is first approved
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        -- Get partner-specific override if exists
        SELECT commission_rate_override INTO partner_override
        FROM public.partners
        WHERE id = NEW.partner_id;

        -- Get system default rate
        SELECT COALESCE(
            (SELECT value::numeric FROM public.system_settings WHERE key = 'commission_rate'),
            7  -- Default fallback if no setting exists
        ) INTO system_rate;

        -- Use partner override if set, otherwise system rate
        commission_rate := COALESCE(partner_override, system_rate);

        -- Insert the commission fee with the correct rate
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
            commission_rate / 100,  -- Store as decimal (e.g., 0.10 for 10%)
            FLOOR(NEW.price_before_rut * (commission_rate / 100))
        );
    END IF;

    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_offer_approved
    AFTER UPDATE ON public.offers
    FOR EACH ROW EXECUTE FUNCTION public.create_commission_fee();

-- Also add a trigger for when an offer is inserted with approved status directly
-- (in case admin creates a pre-approved offer)
CREATE OR REPLACE FUNCTION public.create_commission_fee_on_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    commission_rate NUMERIC(5,2);
    partner_override NUMERIC(5,2);
    system_rate NUMERIC(5,2);
BEGIN
    -- Only create fee if inserted as approved
    IF NEW.status = 'approved' THEN
        -- Get partner-specific override if exists
        SELECT commission_rate_override INTO partner_override
        FROM public.partners
        WHERE id = NEW.partner_id;

        -- Get system default rate
        SELECT COALESCE(
            (SELECT value::numeric FROM public.system_settings WHERE key = 'commission_rate'),
            7  -- Default fallback if no setting exists
        ) INTO system_rate;

        -- Use partner override if set, otherwise system rate
        commission_rate := COALESCE(partner_override, system_rate);

        -- Insert the commission fee with the correct rate
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
            commission_rate / 100,
            FLOOR(NEW.price_before_rut * (commission_rate / 100))
        );
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER on_offer_approved_insert
    AFTER INSERT ON public.offers
    FOR EACH ROW EXECUTE FUNCTION public.create_commission_fee_on_insert();

-- Add a comment explaining the commission calculation
COMMENT ON FUNCTION public.create_commission_fee() IS
'Creates commission fee record when an offer is approved.
Uses partner-specific commission_rate_override if set,
otherwise falls back to system_settings commission_rate,
with a final fallback of 7% if no settings exist.';