-- Drop the existing RLS policy that filters by coverage area
DROP POLICY IF EXISTS "Approved partners can view quotes" ON public.quote_requests;

-- Create new policy that allows all approved partners to view all pending/offers_received quotes
CREATE POLICY "Approved partners can view quotes" 
ON public.quote_requests 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR (
    EXISTS (
      SELECT 1 FROM partners p
      WHERE p.user_id = auth.uid() 
      AND p.status = 'approved'::partner_status
    )
    AND status IN ('pending'::quote_status, 'offers_received'::quote_status)
  )
);