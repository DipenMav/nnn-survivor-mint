-- Create table to track NFT mints
CREATE TABLE IF NOT EXISTS public.nnn_mints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL UNIQUE,
  minted_at timestamp with time zone DEFAULT now(),
  transaction_hash text,
  token_id integer,
  farcaster_fid integer
);

-- Enable RLS
ALTER TABLE public.nnn_mints ENABLE ROW LEVEL SECURITY;

-- Public read policy (anyone can see minted addresses)
CREATE POLICY "Anyone can view mints"
  ON public.nnn_mints
  FOR SELECT
  USING (true);

-- Public insert policy (anyone can mint)
CREATE POLICY "Anyone can mint"
  ON public.nnn_mints
  FOR INSERT
  WITH CHECK (true);

-- Create index on wallet address for faster lookups
CREATE INDEX IF NOT EXISTS idx_nnn_mints_wallet ON public.nnn_mints(wallet_address);

-- Create function to get total mints
CREATE OR REPLACE FUNCTION public.get_total_mints()
RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(*)::integer FROM public.nnn_mints;
$$;