import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const TOTAL_SUPPLY = 69;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { wallet_address, farcaster_fid } = await req.json();

    if (!wallet_address) {
      return new Response(
        JSON.stringify({ error: "Wallet address is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Normalize wallet address to lowercase for consistency
    const normalizedAddress = wallet_address.toLowerCase();

    // Check if wallet already minted
    const { data: existingMint, error: checkError } = await supabase
      .from("nnn_mints")
      .select("*")
      .eq("wallet_address", normalizedAddress)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing mint:", checkError);
      throw checkError;
    }

    if (existingMint) {
      return new Response(
        JSON.stringify({ error: "Wallet has already minted" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check total supply
    const { count, error: countError } = await supabase
      .from("nnn_mints")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("Error counting mints:", countError);
      throw countError;
    }

    if (count && count >= TOTAL_SUPPLY) {
      return new Response(
        JSON.stringify({ error: "All NFTs have been minted" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Calculate token ID (1-based, from 1 to 69)
    const tokenId = (count || 0) + 1;

    // Record the mint in database
    const { data: mintData, error: mintError } = await supabase
      .from("nnn_mints")
      .insert({
        wallet_address: normalizedAddress,
        farcaster_fid: farcaster_fid || null,
        token_id: tokenId,
        transaction_hash: null, // Will be updated when actual on-chain mint happens
      })
      .select()
      .single();

    if (mintError) {
      console.error("Error recording mint:", mintError);
      throw mintError;
    }

    console.log("Mint successful:", {
      wallet: normalizedAddress,
      tokenId,
      fid: farcaster_fid,
    });

    return new Response(
      JSON.stringify({
        success: true,
        token_id: tokenId,
        wallet_address: normalizedAddress,
        message: "NFT minted successfully!",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Mint error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
