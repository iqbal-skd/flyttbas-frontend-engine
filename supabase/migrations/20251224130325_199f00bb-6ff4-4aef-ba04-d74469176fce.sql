-- Drop and recreate the insert policy to ensure it works correctly for anonymous users
DROP POLICY IF EXISTS "Anyone can create quote" ON public.quote_requests;

-- Create a proper insert policy that allows anyone to submit a quote
CREATE POLICY "Anyone can create quote" 
ON public.quote_requests 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);