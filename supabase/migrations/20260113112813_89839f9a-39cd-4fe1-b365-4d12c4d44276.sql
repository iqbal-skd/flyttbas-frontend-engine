-- Create a security definer function to check if user is an approved partner
CREATE OR REPLACE FUNCTION public.is_approved_partner(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.partners
    WHERE user_id = _user_id
      AND status = 'approved'
  )
$$;

-- Drop the problematic policy
DROP POLICY IF EXISTS "Approved partners can view quotes" ON public.quote_requests;

-- Recreate with security definer function to avoid recursion
CREATE POLICY "Approved partners can view quotes" 
ON public.quote_requests 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR (
    is_approved_partner(auth.uid()) 
    AND status IN ('pending', 'offers_received')
  )
);