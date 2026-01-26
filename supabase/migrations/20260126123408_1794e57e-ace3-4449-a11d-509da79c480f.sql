-- Remove the foreign key constraint on quote_requests.customer_id to auth.users
-- This constraint causes issues when creating users via signup as the user might not be immediately available
-- Customer matching is already handled via email in RLS policies, so this constraint is not needed

ALTER TABLE public.quote_requests 
DROP CONSTRAINT IF EXISTS quote_requests_customer_id_fkey;