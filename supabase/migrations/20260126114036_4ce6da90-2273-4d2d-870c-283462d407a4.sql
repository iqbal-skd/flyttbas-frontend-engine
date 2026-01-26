-- Add commission_type_override column to partners table
ALTER TABLE public.partners
ADD COLUMN commission_type_override text DEFAULT NULL
CONSTRAINT commission_type_check CHECK (commission_type_override IS NULL OR commission_type_override IN ('percentage', 'fixed'));