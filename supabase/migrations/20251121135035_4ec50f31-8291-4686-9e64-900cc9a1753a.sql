-- Fix search path security warning
CREATE OR REPLACE FUNCTION public.get_total_mints()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer FROM public.nnn_mints;
$$;