-- Fix search_path for haversine_distance function
CREATE OR REPLACE FUNCTION public.haversine_distance(
    lat1 numeric,
    lng1 numeric,
    lat2 numeric,
    lng2 numeric
)
RETURNS numeric
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
    SELECT (
        6371 * acos(
            cos(radians(lat1)) * cos(radians(lat2)) * cos(radians(lng2) - radians(lng1)) +
            sin(radians(lat1)) * sin(radians(lat2))
        )
    )::numeric
$$;