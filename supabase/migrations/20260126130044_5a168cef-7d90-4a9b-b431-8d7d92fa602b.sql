-- Add flexible_days column to quote_requests table
-- Stores the flexibility window in days: 1, 2, or 3 (meaning ±1, ±2, or ±3 days)
ALTER TABLE public.quote_requests
ADD COLUMN flexible_days integer DEFAULT NULL
CHECK (flexible_days IS NULL OR flexible_days IN (1, 2, 3));

-- Add comment for documentation
COMMENT ON COLUMN public.quote_requests.flexible_days IS 'Flexibility window in days (1=±1 day, 2=±2 days, 3=±3 days). NULL if not flexible.';