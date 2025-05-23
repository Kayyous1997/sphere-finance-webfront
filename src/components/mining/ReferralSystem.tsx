
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, Copy, Award, Share2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { miningService } from "@/services/miningService";

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
  const [localReferralCount, setLocalReferralCount] = useState(referralCount);
  const [localTotalBonus, setLocalTotalBonus] = useState(totalBonus);
  const [localReferralCode, setLocalReferralCode] = useState(referralCode);
  const [subscribed, setSubscribed] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Subscribe to real-time referral updates with improved logging
  useEffect(() => {
    if (!userId) return;

    console.log("Setting up referral subscription for user:", userId);
    
    // Initialize with passed props
    setLocalReferralCount(referralCount);
    setLocalTotalBonus(totalBonus);
    setLocalReferralCode(referralCode);
    
    // Fetch initial referral data to ensure we have the latest count
    const fetchInitialData = async () => {
      try {
        const data = await miningService.getUserReferrals(userId);
        console.log("Initial referral data:", data);
        setLocalReferralCount(data.count);
        setLocalReferralCode(data.code || referralCode);
        
        // Calculate bonus based on count
        const baseBonus = data.count * 5;
        let milestoneBonus = 0;
        
        if (data.count >= 50) milestoneBonus = 100;
        else if (data.count >= 25) milestoneBonus = 50;
        else if (data.count >= 10) milestoneBonus = 25;
        else if (data.count >= 5) milestoneBonus = 10;
        
        setLocalTotalBonus(baseBonus + milestoneBonus);
      } catch (err) {
        console.error("Error fetching initial referral data:", err);
      }
    };
    
    fetchInitialData();
    
    // Subscribe to referral updates with enhanced logging
    const subscription = miningService.subscribeToReferralUpdates(userId, (data) => {
      console.log(`Received referral update at ${new Date().toISOString()}:`, data);
      
      if (data.count !== localReferralCount) {
        console.log(`Referral count changed from ${localReferralCount} to ${data.count}`);
        setLocalReferralCount(data.count);
        setLastUpdateTime(new Date());
        
        // Recalculate bonus based on new count
        const baseBonus = data.count * 5;
        let milestoneBonus = 0;
        
        if (data.count >= 50) milestoneBonus = 100;
        else if (data.count >= 25) milestoneBonus = 50;
        else if (data.count >= 10) milestoneBonus = 25;
        else if (data.count >= 5) milestoneBonus = 10;
        
        setLocalTotalBonus(baseBonus + milestoneBonus);
      }
      
      // Update referral code if available
      if (data.code && data.code !== localReferralCode) {
        setLocalReferralCode(data.code);
      }
      
      setSubscribed(true);
    });
    
    // Cleanup subscription on unmount
    return () => {
      console.log("Cleaning up referral subscription for user:", userId);
      subscription.unsubscribe();
      setSubscribed(false);
    };
  }, [userId, referralCount, totalBonus, referralCode, localReferralCount, localReferralCode]);

  // Manually refresh referral data
  const refreshReferralData = async () => {
    if (!userId || isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      const data = await miningService.getUserReferrals(userId);
      
      setLocalReferralCount(data.count);
      setLocalTotalBonus(data.count * 5 + (
        data.count >= 50 ? 100 : 
        data.count >= 25 ? 50 : 
        data.count >= 10 ? 25 : 
        data.count >= 5 ? 10 : 0
      ));
      
      if (data.code) {
        setLocalReferralCode(data.code);
      }
      
      setLastUpdateTime(new Date());
      toast.success("Referral data refreshed");
    } catch (error) {
      console.error("Error refreshing referral data:", error);
      toast.error("Failed to refresh referral data");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate milestone progress
  const getNextMilestone = () => {
    if (localReferralCount < 5) return { target: 5, bonus: 10 };
    if (localReferralCount < 10) return { target: 10, bonus: 25 };
    if (localReferralCount < 25) return { target: 25, bonus: 50 };
    if (localReferralCount < 50) return { target: 50, bonus: 100 };
    return { target: 50, bonus: 100 }; // Already at max
  };

  const nextMilestone = getNextMilestone();
  const milestoneProgress = localReferralCount >= 50 
    ? 100 
    : Math.floor((localReferralCount / nextMilestone.target) * 100);

  // Generate referral code if none exists
  const generatedCode = localReferralCode || `SPH${userId.substring(0, 8)}`;

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
          <div className="flex items-center">
            <h2 className="text-xl font-bold flex items-center">
              <Users className="mr-2 text-sphere-green" /> Referral System
              {subscribed && <span className="ml-2 text-xs text-green-500">(Live)</span>}
              {lastUpdateTime && <span className="ml-2 text-xs text-blue-400">(Updated: {lastUpdateTime.toLocaleTimeString()})</span>}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              onClick={refreshReferralData}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <div className="bg-sphere-card-dark px-3 py-1.5 rounded text-sm">
              <span className="text-gray-400 mr-1">Current bonus:</span>
              <span className="text-sphere-green font-medium">+{localTotalBonus}%</span>
            </div>
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
              <div className="text-xl font-medium">{localReferralCount}</div>
            </div>
            <div className="bg-sphere-card-dark p-3 rounded-md">
              <div className="text-gray-400 text-sm mb-1">Base Bonus</div>
              <div className="text-xl font-medium">+{localReferralCount * 5}%</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Milestone Bonuses</h3>
            <div className="grid grid-cols-4 gap-2">
              <MilestoneCard count={5} bonus={10} achieved={localReferralCount >= 5} />
              <MilestoneCard count={10} bonus={25} achieved={localReferralCount >= 10} />
              <MilestoneCard count={25} bonus={50} achieved={localReferralCount >= 25} />
              <MilestoneCard count={50} bonus={100} achieved={localReferralCount >= 50} />
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
