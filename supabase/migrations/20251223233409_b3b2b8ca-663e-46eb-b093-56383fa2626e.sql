-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Anyone can create quote" ON public.quote_requests;

-- Create a proper PERMISSIVE INSERT policy that allows anyone to create quotes
CREATE POLICY "Anyone can create quote" 
ON public.quote_requests 
FOR INSERT 
TO public
WITH CHECK (true);