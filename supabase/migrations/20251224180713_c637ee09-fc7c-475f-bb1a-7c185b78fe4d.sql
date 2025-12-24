-- Add lat/lng columns to quote_requests for from_address
ALTER TABLE public.quote_requests 
ADD COLUMN IF NOT EXISTS from_lat numeric,
ADD COLUMN IF NOT EXISTS from_lng numeric;

-- Create Haversine distance function for calculating distance between two points
CREATE OR REPLACE FUNCTION public.haversine_distance(
    lat1 numeric,
    lng1 numeric,
    lat2 numeric,
    lng2 numeric
)
RETURNS numeric
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT (
        6371 * acos(
            cos(radians(lat1)) * cos(radians(lat2)) * cos(radians(lng2) - radians(lng1)) +
            sin(radians(lat1)) * sin(radians(lat2))
        )
    )::numeric
$$;

-- Drop the existing policy and create a new one with distance filtering
DROP POLICY IF EXISTS "Approved partners can view quotes" ON public.quote_requests;

CREATE POLICY "Approved partners can view quotes" 
ON public.quote_requests 
FOR SELECT 
USING (
    has_role(auth.uid(), 'admin'::app_role) 
    OR (
        EXISTS (
            SELECT 1
            FROM partners p
            WHERE p.user_id = auth.uid()
              AND p.status = 'approved'::partner_status
              AND (
                  -- Check postal code match OR empty postal codes list
                  (quote_requests.from_postal_code = ANY (p.service_postal_codes) OR cardinality(p.service_postal_codes) = 0)
              )
              AND (
                  -- Check distance if partner has address and quote has location
                  p.address_lat IS NULL 
                  OR p.address_lng IS NULL 
                  OR quote_requests.from_lat IS NULL 
                  OR quote_requests.from_lng IS NULL
                  OR p.max_drive_distance_km IS NULL
                  OR public.haversine_distance(
                      p.address_lat, 
                      p.address_lng, 
                      quote_requests.from_lat, 
                      quote_requests.from_lng
                  ) <= p.max_drive_distance_km
              )
        )
        AND quote_requests.status = ANY (ARRAY['pending'::quote_status, 'offers_received'::quote_status])
    )
);