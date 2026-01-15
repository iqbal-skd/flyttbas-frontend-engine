-- Add to_lat and to_lng columns to quote_requests table
ALTER TABLE public.quote_requests
ADD COLUMN IF NOT EXISTS to_lat numeric,
ADD COLUMN IF NOT EXISTS to_lng numeric;

-- Add comment for documentation
COMMENT ON COLUMN public.quote_requests.to_lat IS 'Latitude of the destination address';
COMMENT ON COLUMN public.quote_requests.to_lng IS 'Longitude of the destination address';
