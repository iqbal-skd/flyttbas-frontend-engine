-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Anyone can create quote" ON public.quote_requests;

-- Create a proper PERMISSIVE INSERT policy that allows anonymous and authenticated users to create quotes
CREATE POLICY "Anyone can create quote" 
ON public.quote_requests 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);