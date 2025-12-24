-- Drop the restrictive policy and create a permissive one
DROP POLICY IF EXISTS "Anyone can create quote" ON public.quote_requests;

-- Create a PERMISSIVE insert policy that allows anyone to submit a quote
CREATE POLICY "Anyone can create quote" 
ON public.quote_requests 
FOR INSERT 
TO public
WITH CHECK (true);