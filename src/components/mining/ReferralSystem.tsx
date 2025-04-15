
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, Copy, Award, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ReferralSystemProps {
  userId: string;
  referralCode?: string;
  referralCount: number;
  totalBonus: number;
}

const ReferralSystem = ({ 
  userId, 
  referralCode = "", 
  referralCount = 0, 
  totalBonus = 0 
}: ReferralSystemProps) => {
  const [showShare, setShowShare] = useState(false);

  // Calculate milestone progress
  const getNextMilestone = () => {
    if (referralCount < 5) return { target: 5, bonus: 10 };
    if (referralCount < 10) return { target: 10, bonus: 25 };
    if (referralCount < 25) return { target: 25, bonus: 50 };
    if (referralCount < 50) return { target: 50, bonus: 100 };
    return { target: 50, bonus: 100 }; // Already at max
  };

  const nextMilestone = getNextMilestone();
  const milestoneProgress = referralCount >= 50 
    ? 100 
    : Math.floor((referralCount / nextMilestone.target) * 100);

  // Generate referral code if none exists
  const generatedCode = referralCode || `SPH${userId.substring(0, 8)}`;

  // Copy referral link to clipboard
  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/?ref=${generatedCode}`;
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard!");
  };

  // Share referral link
  const shareReferralLink = () => {
    setShowShare(!showShare);
  };

  return (
    <Card className="card-gradient">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <Users className="mr-2 text-sphere-green" /> Referral System
          </h2>
          <div className="bg-sphere-card-dark px-3 py-1.5 rounded text-sm">
            <span className="text-gray-400 mr-1">Current bonus:</span>
            <span className="text-sphere-green font-medium">+{totalBonus}%</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-sphere-card-dark p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="text-gray-400 text-sm">Your Referral Code</div>
                <div className="text-lg font-medium">{generatedCode}</div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs" 
                  onClick={copyReferralLink}
                >
                  <Copy className="w-3 h-3 mr-1" /> Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs" 
                  onClick={shareReferralLink}
                >
                  <Share2 className="w-3 h-3 mr-1" /> Share
                </Button>
              </div>
            </div>
            {showShare && (
              <div className="mt-3 bg-black bg-opacity-30 p-3 rounded-md text-xs">
                <p className="mb-2">Share your referral link:</p>
                <p className="font-mono bg-black bg-opacity-50 p-2 rounded">{window.location.origin}/?ref={generatedCode}</p>
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-1 text-sphere-green" />
                <span>Next Milestone: {nextMilestone.target} Referrals</span>
              </div>
              <span className="text-sphere-green">+{nextMilestone.bonus}% Bonus</span>
            </div>
            <Progress value={milestoneProgress} className="h-2 bg-sphere-card-dark" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-sphere-card-dark p-3 rounded-md">
              <div className="text-gray-400 text-sm mb-1">Total Referrals</div>
              <div className="text-xl font-medium">{referralCount}</div>
            </div>
            <div className="bg-sphere-card-dark p-3 rounded-md">
              <div className="text-gray-400 text-sm mb-1">Base Bonus</div>
              <div className="text-xl font-medium">+{referralCount * 5}%</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Milestone Bonuses</h3>
            <div className="grid grid-cols-4 gap-2">
              <MilestoneCard count={5} bonus={10} achieved={referralCount >= 5} />
              <MilestoneCard count={10} bonus={25} achieved={referralCount >= 10} />
              <MilestoneCard count={25} bonus={50} achieved={referralCount >= 25} />
              <MilestoneCard count={50} bonus={100} achieved={referralCount >= 50} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper component for milestone cards
const MilestoneCard = ({ count, bonus, achieved }: { count: number; bonus: number; achieved: boolean }) => (
  <div className={`rounded-md p-2 text-center ${achieved ? 'bg-sphere-green bg-opacity-20 border border-sphere-green' : 'bg-sphere-card-dark'}`}>
    <div className="text-xs text-gray-400">{count} Refs</div>
    <div className="text-sm font-medium">{achieved ? '✓' : '+'}{bonus}%</div>
  </div>
);

export default ReferralSystem;
