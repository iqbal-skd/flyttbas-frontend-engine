-- Migration: Create default admin user
-- Creates admin@flyttbas.se with admin role if not exists

DO $$
DECLARE
    admin_user_id UUID;
    admin_email TEXT := 'admin@flyttbas.se';
BEGIN
    -- Check if user already exists
    SELECT id INTO admin_user_id FROM auth.users WHERE email = admin_email;

    -- If user doesn't exist, create them
    IF admin_user_id IS NULL THEN
        admin_user_id := '00000000-0000-0000-0000-000000000001'::uuid;

        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            role,
            aud,
            confirmation_token,
            recovery_token,
            email_change_token_new,
            email_change
        )
        VALUES (
            admin_user_id,
            '00000000-0000-0000-0000-000000000000'::uuid,
            admin_email,
            crypt('Password@123', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}'::jsonb,
            '{"name": "Admin"}'::jsonb,
            FALSE,
            'authenticated',
            'authenticated',
            '',
            '',
            '',
            ''
        );

        -- Create identity for the admin user (required for email login)
        INSERT INTO auth.identities (
            id,
            user_id,
            provider_id,
            identity_data,
            provider,
            last_sign_in_at,
            created_at,
            updated_at
        )
        VALUES (
            admin_user_id,
            admin_user_id,
            admin_email,
            jsonb_build_object(
                'sub', admin_user_id::text,
                'email', admin_email,
                'email_verified', true,
                'provider', 'email'
            ),
            'email',
            NOW(),
            NOW(),
            NOW()
        );
    END IF;

    -- Assign admin role to the user (whether new or existing)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    RAISE NOTICE 'Admin user configured with ID: %', admin_user_id;
END $$;
