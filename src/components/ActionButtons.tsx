import { Button } from "@/components/ui/button";
import { Home, Share2, Heart } from "lucide-react";

interface ActionButtonsProps {
  onAddToHome: () => void;
  onShare: () => void;
  onTip: () => void;
}

export const ActionButtons = ({ onAddToHome, onShare, onTip }: ActionButtonsProps) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Button
        onClick={onAddToHome}
        variant="outline"
        className="border-gold/50 hover:bg-gold/10 hover:border-gold"
      >
        <Home className="mr-2 h-4 w-4" />
        Add
      </Button>
      
      <Button
        onClick={onShare}
        variant="outline"
        className="border-gold/50 hover:bg-gold/10 hover:border-gold"
      >
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
      
      <Button
        onClick={onTip}
        variant="outline"
        className="border-gold/50 hover:bg-gold/10 hover:border-gold"
      >
        <Heart className="mr-2 h-4 w-4" />
        Tip
      </Button>
    </div>
  );
};
