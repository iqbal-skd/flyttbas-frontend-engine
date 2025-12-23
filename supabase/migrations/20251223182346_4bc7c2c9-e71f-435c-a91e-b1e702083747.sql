-- Add address and location columns to partners table
ALTER TABLE public.partners
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS address_lat NUMERIC,
ADD COLUMN IF NOT EXISTS address_lng NUMERIC;