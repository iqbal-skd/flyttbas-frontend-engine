-- Migration: Add commission settings
-- Creates system_settings table and adds commission_rate_override to partners

-- Create system_settings table for global configuration
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies for system_settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can read system settings
CREATE POLICY "Admins can read system settings"
    ON public.system_settings
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Only admins can insert system settings
CREATE POLICY "Admins can insert system settings"
    ON public.system_settings
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Only admins can update system settings
CREATE POLICY "Admins can update system settings"
    ON public.system_settings
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Insert default commission rate
INSERT INTO public.system_settings (key, value, description)
VALUES (
    'commission_rate',
    '7'::jsonb,
    'Default commission rate percentage for all partners'
)
ON CONFLICT (key) DO NOTHING;

-- Add commission_rate_override column to partners table
ALTER TABLE public.partners
ADD COLUMN IF NOT EXISTS commission_rate_override NUMERIC(5,2) DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.partners.commission_rate_override IS 'Custom commission rate for this partner. If NULL, system default is used.';

-- Create function to get effective commission rate for a partner
CREATE OR REPLACE FUNCTION get_partner_commission_rate(partner_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
    partner_rate NUMERIC;
    system_rate NUMERIC;
BEGIN
    -- Get partner's custom rate
    SELECT commission_rate_override INTO partner_rate
    FROM public.partners
    WHERE id = partner_uuid;

    -- If partner has custom rate, return it
    IF partner_rate IS NOT NULL THEN
        RETURN partner_rate;
    END IF;

    -- Otherwise get system default
    SELECT (value::text)::numeric INTO system_rate
    FROM public.system_settings
    WHERE key = 'commission_rate';

    -- Return system rate or fallback to 7
    RETURN COALESCE(system_rate, 7);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_partner_commission_rate(UUID) TO authenticated;

-- Create trigger to update updated_at on system_settings
CREATE OR REPLACE FUNCTION update_system_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER system_settings_updated_at
    BEFORE UPDATE ON public.system_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_system_settings_updated_at();