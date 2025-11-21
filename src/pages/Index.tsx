import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { NFTCard } from "@/components/NFTCard";
import { MintButton } from "@/components/MintButton";
import { ActionButtons } from "@/components/ActionButtons";
import { supabase } from "@/integrations/supabase/client";
import {
  initializeFarcaster,
  signInWithFarcaster,
  addToMiniApps,
  sendTipToCreator,
  openUrl,
} from "@/lib/farcaster";

const TOTAL_SUPPLY = 69;

const Index = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [totalMints, setTotalMints] = useState(0);
  const [hasMinted, setHasMinted] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Farcaster SDK
    initializeFarcaster().catch(console.error);
    
    // Load mint count
    loadMintCount();
  }, []);

  const loadMintCount = async () => {
    try {
      const { data, error } = await supabase
        .from("nnn_mints")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      
      setTotalMints(data?.length || 0);
    } catch (error) {
      console.error("Error loading mint count:", error);
    }
  };

  const checkIfMinted = async (address: string) => {
    try {
      const { data, error } = await supabase
        .from("nnn_mints")
        .select("*")
        .eq("wallet_address", address.toLowerCase())
        .maybeSingle();

      if (error) throw error;
      
      setHasMinted(!!data);
      return !!data;
    } catch (error) {
      console.error("Error checking mint status:", error);
      return false;
    }
  };

  const handleMint = async () => {
    try {
      setLoading(true);

      // Sign in with Farcaster to get wallet address
      const signInResult = await signInWithFarcaster();
      
      if (!signInResult) {
        toast({
          title: "Sign-in required",
          description: "Please sign in with your Farcaster wallet to mint.",
          variant: "destructive",
        });
        return;
      }

      const { address, fid } = signInResult;
      setWalletAddress(address);

      // Check if already minted
      const alreadyMinted = await checkIfMinted(address);
      if (alreadyMinted) {
        toast({
          title: "Already minted",
          description: "You've already claimed your NFT!",
          variant: "destructive",
        });
        return;
      }

      // Check supply
      if (totalMints >= TOTAL_SUPPLY) {
        toast({
          title: "Sold out",
          description: "All NFTs have been minted!",
          variant: "destructive",
        });
        return;
      }

      // Call mint API
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mint-nnn`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          wallet_address: address,
          farcaster_fid: fid,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to mint");
      }

      toast({
        title: "Success! 🎉",
        description: "Your NNN Survivor NFT has been minted!",
      });

      setHasMinted(true);
      loadMintCount();

    } catch (error: any) {
      console.error("Mint error:", error);
      toast({
        title: "Mint failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToHome = async () => {
    try {
      await addToMiniApps();
      toast({
        title: "Added!",
        description: "Mini App added to your Warpcast home.",
      });
    } catch (error) {
      console.error("Add to home error:", error);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.origin;
    const shareText = `I just minted the NNN Survivor NFT! Only ${TOTAL_SUPPLY - totalMints} left. Only the disciplined survive! 💪`;
    
    try {
      await openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(shareUrl)}`);
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handleTip = async () => {
    try {
      await sendTipToCreator();
      toast({
        title: "Thank you! 🙏",
        description: "Your support means a lot!",
      });
    } catch (error) {
      console.error("Tip error:", error);
    }
  };

  const remainingSupply = TOTAL_SUPPLY - totalMints;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-slide-up">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter bg-gradient-gold bg-clip-text text-transparent">
            NO NUT NOVEMBER
          </h1>
          <p className="text-muted-foreground font-medium tracking-wide">
            ONLY THE DISCIPLINED SURVIVE
          </p>
        </div>

        {/* NFT Card */}
        <NFTCard remainingSupply={remainingSupply} totalSupply={TOTAL_SUPPLY} />

        {/* Supply Info */}
        <div className="text-center space-y-1">
          <p className="text-2xl font-bold text-gold">
            {remainingSupply} / {TOTAL_SUPPLY} Remaining
          </p>
          <p className="text-sm text-muted-foreground">
            Limited Edition • Free Mint • Base Chain
          </p>
        </div>

        {/* Mint Button */}
        <MintButton
          onClick={handleMint}
          disabled={loading || remainingSupply === 0 || hasMinted}
          loading={loading}
          hasMinted={hasMinted}
        />

        {/* Action Buttons */}
        <ActionButtons
          onAddToHome={handleAddToHome}
          onShare={handleShare}
          onTip={handleTip}
        />

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
          <p>One mint per wallet • Gas fees only</p>
          <p className="mt-1">Built for the disciplined 💪</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
