
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";

interface RewardsCardProps {
  userPoints: number;
  claimingRewards: boolean;
  onClaimRewards: () => void;
}

const RewardsCard = ({ userPoints, claimingRewards, onClaimRewards }: RewardsCardProps) => {
  return (
    <Card className="card-gradient">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold mb-1">Your Points: {userPoints}</h2>
            <p className="text-gray-400 text-sm">Complete tasks to earn more points</p>
          </div>
          <Button 
            className="bg-sphere-green text-black hover:bg-green-400"
            onClick={onClaimRewards}
            disabled={claimingRewards}
          >
            {claimingRewards ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Claim Rewards
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsCard;
