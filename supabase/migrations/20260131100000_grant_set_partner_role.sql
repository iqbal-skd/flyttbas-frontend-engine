-- Migration: Grant EXECUTE permission on set_partner_role to anon and authenticated
-- The function was created in 20251223192211 but never granted execute permissions.
-- After signUp() with email confirmation, the client is unauthenticated (anon role)
-- and cannot call this RPC function without an explicit grant.

GRANT EXECUTE ON FUNCTION public.set_partner_role(uuid) TO anon, authenticated;
