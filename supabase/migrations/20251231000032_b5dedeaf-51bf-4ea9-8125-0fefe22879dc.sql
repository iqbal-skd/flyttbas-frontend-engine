-- Create job_status enum for tracking job progress
CREATE TYPE public.job_status AS ENUM (
  'confirmed',
  'scheduled', 
  'in_progress',
  'completed',
  'cancelled'
);

-- Add job_status column to offers table (only applicable for approved offers)
ALTER TABLE public.offers 
ADD COLUMN job_status public.job_status DEFAULT NULL,
ADD COLUMN job_status_updated_at timestamp with time zone DEFAULT NULL,
ADD COLUMN job_notes text DEFAULT NULL;

-- Create index for job status queries
CREATE INDEX idx_offers_job_status ON public.offers(job_status) WHERE job_status IS NOT NULL;