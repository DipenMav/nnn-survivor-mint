import { Card } from "@/components/ui/card";
import nnnImage from "@/assets/nnn-survivor.png";

interface NFTCardProps {
  remainingSupply: number;
  totalSupply: number;
}

export const NFTCard = ({ remainingSupply, totalSupply }: NFTCardProps) => {
  return (
    <Card className="relative overflow-hidden border-2 border-gold/50 bg-card p-0 shadow-gold">
      {/* Gold frame corners */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-gold" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-gold" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-gold" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-gold" />
      
      {/* NFT Image */}
      <div className="p-4">
        <img 
          src={nnnImage} 
          alt="NNN Survivor NFT" 
          className="w-full h-auto rounded"
        />
      </div>
      
      {/* Supply badge */}
      <div className="absolute bottom-6 right-6 bg-gold text-background px-4 py-2 font-bold text-lg">
        {totalSupply - remainingSupply}/{totalSupply}
      </div>
    </Card>
  );
};
