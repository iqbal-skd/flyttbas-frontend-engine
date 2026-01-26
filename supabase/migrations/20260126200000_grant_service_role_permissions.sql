-- Migration: Grant service_role permissions for Edge Functions
-- The service_role needs explicit GRANT permissions to access tables from Edge Functions

-- Grant service_role full access to all necessary tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partners TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quote_requests TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.offers TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.commission_fees TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_logs TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_settings TO service_role;

-- Grant sequence usage
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;
