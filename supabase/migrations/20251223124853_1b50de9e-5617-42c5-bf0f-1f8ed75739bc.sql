-- Create a function to promote a user to admin by email (for development/testing only)
CREATE OR REPLACE FUNCTION public.promote_to_admin(target_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    target_user_id uuid;
BEGIN
    -- Find the user_id from profiles
    SELECT user_id INTO target_user_id
    FROM public.profiles
    WHERE email = target_email;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', target_email;
    END IF;
    
    -- Insert admin role if not exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Create a function to make a user a partner (for testing)
CREATE OR REPLACE FUNCTION public.promote_to_partner(target_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    target_user_id uuid;
BEGIN
    SELECT user_id INTO target_user_id
    FROM public.profiles
    WHERE email = target_email;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', target_email;
    END IF;
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'partner')
    ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;