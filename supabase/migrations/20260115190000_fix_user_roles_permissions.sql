-- Migration: Fix table permissions for all tables
-- Grant proper permissions to authenticated and anon roles so RLS policies can work

-- =============================================
-- GRANT PERMISSIONS TO AUTHENTICATED ROLE
-- =============================================

-- user_roles: Users need to read their own roles
GRANT SELECT ON public.user_roles TO authenticated;

-- profiles: Users need full access to their own profile
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

-- partners: Partners need access, admins need full access
GRANT SELECT, INSERT, UPDATE ON public.partners TO authenticated;

-- quote_requests: Customers and partners need access
GRANT SELECT, INSERT, UPDATE ON public.quote_requests TO authenticated;

-- offers: Partners create offers, customers view them
GRANT SELECT, INSERT, UPDATE ON public.offers TO authenticated;

-- commission_fees: Partners view their fees, admins manage
GRANT SELECT ON public.commission_fees TO authenticated;

-- audit_logs: System inserts, admins read
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;

-- reviews: Anyone can view, customers can create
GRANT SELECT, INSERT ON public.reviews TO authenticated;

-- system_settings: Admins manage settings
GRANT SELECT, INSERT, UPDATE ON public.system_settings TO authenticated;

-- =============================================
-- GRANT PERMISSIONS TO ANON ROLE (for public forms)
-- =============================================

-- quote_requests: Anyone can create a quote request (public form)
GRANT INSERT ON public.quote_requests TO anon;

-- profiles: Anon needs to check if email exists during registration
GRANT SELECT ON public.profiles TO anon;

-- partners: Public can view approved partners + check during registration
GRANT SELECT, INSERT ON public.partners TO anon;

-- reviews: Anyone can view reviews
GRANT SELECT ON public.reviews TO anon;

-- user_roles: Anon needs to insert via RPC during registration
GRANT SELECT, INSERT ON public.user_roles TO anon;

-- =============================================
-- GRANT SEQUENCE PERMISSIONS (for auto-generated IDs)
-- =============================================
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- =============================================
-- FIX PARTNER REGISTRATION - USE SECURITY DEFINER FUNCTION
-- =============================================

-- Drop the existing policy that requires auth.uid() = user_id
DROP POLICY IF EXISTS "Anyone can register as partner" ON public.partners;

-- Create a simple policy that allows insert for authenticated users
CREATE POLICY "Authenticated users can register as partner"
ON public.partners FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create SECURITY DEFINER function for unauthenticated partner registration
-- This allows registration after signUp but before email confirmation
CREATE OR REPLACE FUNCTION public.register_partner(
  p_user_id UUID,
  p_company_name TEXT,
  p_org_number TEXT,
  p_contact_name TEXT,
  p_contact_email TEXT,
  p_contact_phone TEXT,
  p_address TEXT DEFAULT NULL,
  p_address_lat NUMERIC DEFAULT NULL,
  p_address_lng NUMERIC DEFAULT NULL,
  p_traffic_license_number TEXT DEFAULT NULL,
  p_f_tax_certificate BOOLEAN DEFAULT FALSE,
  p_insurance_company TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_partner_id UUID;
BEGIN
  -- Verify user exists in auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id';
  END IF;

  -- Check if partner already exists for this user
  IF EXISTS (SELECT 1 FROM public.partners WHERE user_id = p_user_id) THEN
    RAISE EXCEPTION 'Partner already exists for this user';
  END IF;

  -- Insert the partner record
  INSERT INTO public.partners (
    user_id,
    company_name,
    org_number,
    contact_name,
    contact_email,
    contact_phone,
    address,
    address_lat,
    address_lng,
    traffic_license_number,
    f_tax_certificate,
    insurance_company,
    status
  ) VALUES (
    p_user_id,
    p_company_name,
    p_org_number,
    p_contact_name,
    p_contact_email,
    p_contact_phone,
    p_address,
    p_address_lat,
    p_address_lng,
    p_traffic_license_number,
    p_f_tax_certificate,
    p_insurance_company,
    'pending'
  ) RETURNING id INTO new_partner_id;

  RETURN new_partner_id;
END;
$$;

-- Grant execute permission to anon and authenticated
GRANT EXECUTE ON FUNCTION public.register_partner TO anon, authenticated;

-- =============================================
-- RECREATE RLS POLICIES FOR user_roles
-- =============================================

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
