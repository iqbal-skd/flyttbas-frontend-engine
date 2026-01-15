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

-- partners: Public can view approved partners
GRANT SELECT ON public.partners TO anon;

-- reviews: Anyone can view reviews
GRANT SELECT ON public.reviews TO anon;

-- =============================================
-- GRANT SEQUENCE PERMISSIONS (for auto-generated IDs)
-- =============================================
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

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
