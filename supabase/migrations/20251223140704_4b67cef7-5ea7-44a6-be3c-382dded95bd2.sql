-- Alter ranking_score column to allow larger values
ALTER TABLE public.offers 
ALTER COLUMN ranking_score TYPE NUMERIC(10, 2);