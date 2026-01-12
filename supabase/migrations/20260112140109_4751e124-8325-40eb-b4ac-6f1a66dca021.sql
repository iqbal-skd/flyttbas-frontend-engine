-- Add elevator size columns to quote_requests table
ALTER TABLE public.quote_requests 
ADD COLUMN IF NOT EXISTS elevator_from_size text,
ADD COLUMN IF NOT EXISTS elevator_to_size text;