-- Allow partners to view quote_requests for their approved offers
-- This ensures partners can see full customer details once their offer is accepted

CREATE POLICY "Partners can view quotes for their approved offers"
ON public.quote_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM offers o
    JOIN partners p ON o.partner_id = p.id
    WHERE o.quote_request_id = quote_requests.id
      AND o.status = 'approved'
      AND p.user_id = auth.uid()
  )
);