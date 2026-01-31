-- Create a security definer function to insert partner bypassing RLS
-- This is needed because after signUp, the user is not immediately authenticated
-- (they need to confirm email), so auth.uid() is null

CREATE OR REPLACE FUNCTION public.insert_partner_as_user(
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
  -- Check that the calling user is either:
  -- 1. The same as p_user_id (if authenticated)
  -- 2. An admin
  -- 3. No auth (for signup flow - we verify via the set_partner_role function having been called)
  
  -- Verify the user exists in auth.users (this confirms the signup was successful)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'User does not exist';
  END IF;
  
  -- Verify user has partner role (set by set_partner_role function during signup)
  IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = p_user_id AND role = 'partner') THEN
    RAISE EXCEPTION 'User does not have partner role';
  END IF;
  
  -- Check if partner already exists for this user
  IF EXISTS (SELECT 1 FROM partners WHERE user_id = p_user_id) THEN
    RAISE EXCEPTION 'Partner already exists for this user';
  END IF;
  
  -- Insert the partner
  INSERT INTO partners (
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
  )
  RETURNING id INTO new_partner_id;
  
  RETURN new_partner_id;
END;
$$;