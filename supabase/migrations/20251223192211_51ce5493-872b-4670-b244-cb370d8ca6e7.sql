-- Create a function to update user role from customer to partner
-- This is needed because only admins can delete roles, but we need to swap customer to partner during registration
CREATE OR REPLACE FUNCTION public.set_partner_role(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Delete customer role if exists
    DELETE FROM public.user_roles 
    WHERE user_id = target_user_id AND role = 'customer';
    
    -- Insert partner role if not exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'partner')
    ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;