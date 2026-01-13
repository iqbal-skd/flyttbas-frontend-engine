-- Create security definer function to check if partner has approved offer for a quote
CREATE OR REPLACE FUNCTION public.partner_has_approved_offer_for_quote(_user_id uuid, _quote_request_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.offers o
    JOIN public.partners p ON o.partner_id = p.id
    WHERE o.quote_request_id = _quote_request_id
      AND o.status = 'approved'
      AND p.user_id = _user_id
  )
$$;

-- Create security definer function to check if customer owns a quote request (by quote_request_id)
CREATE OR REPLACE FUNCTION public.customer_owns_quote(_user_id uuid, _quote_request_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.quote_requests qr
    LEFT JOIN public.profiles p ON p.user_id = _user_id
    WHERE qr.id = _quote_request_id
      AND (qr.customer_id = _user_id OR qr.customer_email = p.email)
  )
$$;

-- Drop and recreate the problematic quote_requests policy
DROP POLICY IF EXISTS "Partners can view quotes for their approved offers" ON public.quote_requests;

CREATE POLICY "Partners can view quotes for their approved offers" 
ON public.quote_requests 
FOR SELECT 
USING (partner_has_approved_offer_for_quote(auth.uid(), id));

-- Drop and recreate the offers policies that cause recursion
DROP POLICY IF EXISTS "Customers can view offers on their quotes" ON public.offers;

CREATE POLICY "Customers can view offers on their quotes" 
ON public.offers 
FOR SELECT 
USING (customer_owns_quote(auth.uid(), quote_request_id));

DROP POLICY IF EXISTS "Customers can update offers on their quotes" ON public.offers;

CREATE POLICY "Customers can update offers on their quotes" 
ON public.offers 
FOR UPDATE 
USING (customer_owns_quote(auth.uid(), quote_request_id));