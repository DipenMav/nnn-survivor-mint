import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface MintButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  hasMinted: boolean;
}

export const MintButton = ({ onClick, disabled, loading, hasMinted }: MintButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-16 text-xl font-bold bg-gradient-gold hover:bg-gold-dark text-background border-2 border-gold shadow-brutal hover:shadow-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          Minting...
        </>
      ) : hasMinted ? (
        "Already Minted"
      ) : (
        "MINT FREE NFT"
      )}
    </Button>
  );
};
