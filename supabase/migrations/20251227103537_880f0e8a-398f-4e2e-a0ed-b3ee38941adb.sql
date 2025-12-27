-- Allow customers to update offers on their own quote requests (for approving offers)
CREATE POLICY "Customers can update offers on their quotes"
ON public.offers
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM quote_requests qr
    WHERE qr.id = offers.quote_request_id
    AND (
      qr.customer_id = auth.uid()
      OR qr.customer_email = (
        SELECT profiles.email FROM profiles WHERE profiles.user_id = auth.uid()
      )
    )
  )
);

-- Allow customers to update their own quote requests status
CREATE POLICY "Customers can update own quotes"
ON public.quote_requests
FOR UPDATE
USING (
  customer_id = auth.uid()
  OR customer_email = (
    SELECT profiles.email FROM profiles WHERE profiles.user_id = auth.uid()
  )
);