import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import HashrateChart from "@/components/mining/HashrateChart";
import SharesChart from "@/components/mining/SharesChart";
import ReferralSystem from "@/components/mining/ReferralSystem";
import { useAuth } from "@/contexts/AuthContext";
import { miningService, MiningSession } from "@/services/miningService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const MiningPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSession, setCurrentSession] = useState<MiningSession | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [miningStats, setMiningStats] = useState({
    hashrate: 0,
    sharesAccepted: 0,
    sharesRejected: 0,
    rewards: 0
  });
  const [referralInfo, setReferralInfo] = useState({
    referralCode: "",
    referralCount: 0,
    totalBonus: 0
  });
  
  // Use a ref to track if this is the initial load
  const isInitialLoad = useRef(true);
  // Use a ref to store the last update timestamp to prevent rapid updates
  const lastUpdateTime = useRef(0);
  // Track the update interval
  const updateIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      toast.error("Please login to access the mining dashboard");
      navigate("/");
      return;
    }

    const loadSessionAndReferrals = async () => {
      try {
        setPageLoading(true);
        
        // Load active session
        const session = await miningService.getActiveMiningSession(user.id);
        if (session) {
          setCurrentSession(session);
          setIsActive(true);
          setProgress(100);
          
          // Check for cached mining stats to prevent values from increasing on refresh
          const cachedStatsJson = localStorage.getItem(`mining_stats_${user.id}`);
          if (cachedStatsJson) {
            try {
              const cachedStats = JSON.parse(cachedStatsJson);
              // Only use cached stats if they're from the same session
              if (cachedStats && session.id === cachedStats.sessionId) {
                setMiningStats({
                  hashrate: cachedStats.hashrate || session.total_hashrate,
                  sharesAccepted: cachedStats.sharesAccepted || session.shares_accepted,
                  sharesRejected: cachedStats.sharesRejected || session.shares_rejected,
                  rewards: cachedStats.rewards || session.rewards_earned
                });
              } else {
                // Use session data if cache doesn't match session
                setMiningStats({
                  hashrate: session.total_hashrate,
                  sharesAccepted: session.shares_accepted,
                  sharesRejected: session.shares_rejected,
                  rewards: session.rewards_earned
                });
              }
            } catch (e) {
              // Fallback to session data if cache parsing fails
              setMiningStats({
                hashrate: session.total_hashrate,
                sharesAccepted: session.shares_accepted,
                sharesRejected: session.shares_rejected,
                rewards: session.rewards_earned
              });
            }
          } else {
            // No cache, use session data
            setMiningStats({
              hashrate: session.total_hashrate,
              sharesAccepted: session.shares_accepted,
              sharesRejected: session.shares_rejected,
              rewards: session.rewards_earned
            });
          }
        }

        // Load referrals with caching
        try {
          // Check for cached referral info
          const cachedReferralJson = localStorage.getItem(`referral_info_${user.id}`);
          let shouldFetchReferrals = true;
          
          if (cachedReferralJson) {
            try {
              const cachedReferral = JSON.parse(cachedReferralJson);
              if (cachedReferral && 
                  Date.now() - cachedReferral.timestamp < 60000) { // Cache valid for 1 minute
                // Use cached referral data
                const baseBonus = cachedReferral.count * 5;
                let milestoneBonus = 0;
                if (cachedReferral.count >= 50) milestoneBonus = 100;
                else if (cachedReferral.count >= 25) milestoneBonus = 50;
                else if (cachedReferral.count >= 10) milestoneBonus = 25;
                else if (cachedReferral.count >= 5) milestoneBonus = 10;
                
                setReferralInfo({
                  referralCode: cachedReferral.code || "",
                  referralCount: cachedReferral.count,
                  totalBonus: baseBonus + milestoneBonus
                });
                
                shouldFetchReferrals = false;
              }
            } catch (e) {
              console.error("Error parsing cached referrals:", e);
            }
          }
          
          if (shouldFetchReferrals) {
            // Fetch fresh referral data
            const referrals = await miningService.getUserReferrals(user.id);
            const baseBonus = referrals.count * 5;
            
            let milestoneBonus = 0;
            if (referrals.count >= 50) milestoneBonus = 100;
            else if (referrals.count >= 25) milestoneBonus = 50;
            else if (referrals.count >= 10) milestoneBonus = 25;
            else if (referrals.count >= 5) milestoneBonus = 10;
            
            setReferralInfo({
              referralCode: referrals.code || "",
              referralCount: referrals.count,
              totalBonus: baseBonus + milestoneBonus
            });
          }
        } catch (error) {
          console.error("Error loading referral data:", error);
          setReferralInfo({
            referralCode: "",
            referralCount: 0,
            totalBonus: 0
          });
        }
        
        setPageLoading(false);
        isInitialLoad.current = false;
      } catch (error) {
        console.error("Error loading session data:", error);
        setPageLoading(false);
        isInitialLoad.current = false;
      }
    };

    loadSessionAndReferrals();
  }, [user, navigate, loading]);

  // Set up mining simulation with rate limiting
  useEffect(() => {
    if (!isActive || !currentSession || !user) return;

    // Clear any existing intervals to prevent duplicates
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }

    // Create an update interval with controlled rate of change
    const interval = window.setInterval(async () => {
      const now = Date.now();
      // Limit updates to once every second
      if (now - lastUpdateTime.current < 1000) {
        return;
      }
      
      lastUpdateTime.current = now;
      
      // Create a copy of current stats
      const newStats = { ...miningStats };
      
      // Apply controlled, smaller increments
      newStats.hashrate += (Math.random() * 0.05 - 0.025); // Smaller fluctuation
      if (newStats.hashrate < 0) newStats.hashrate = 0;
      
      // Only occasionally increment shares (20% chance)
      if (Math.random() > 0.8) {
        newStats.sharesAccepted += 1;
      }
      
      // Very rarely increment rejected shares (5% chance)
      if (Math.random() > 0.95) {
        newStats.sharesRejected += 1;
      }
      
      // Small reward increments
      newStats.rewards += (Math.random() * 0.00005); // Much smaller increment
      
      // Update the state
      setMiningStats({
        hashrate: Number(newStats.hashrate.toFixed(2)),
        sharesAccepted: Math.floor(newStats.sharesAccepted),
        sharesRejected: Math.floor(newStats.sharesRejected),
        rewards: Number(newStats.rewards.toFixed(4))
      });
      
      // Store stats in localStorage to prevent increase on refresh
      localStorage.setItem(`mining_stats_${user.id}`, JSON.stringify({
        sessionId: currentSession.id,
        hashrate: Number(newStats.hashrate.toFixed(2)),
        sharesAccepted: Math.floor(newStats.sharesAccepted),
        sharesRejected: Math.floor(newStats.sharesRejected),
        rewards: Number(newStats.rewards.toFixed(4)),
        timestamp: Date.now()
      }));

      // Only sync with server occasionally (10% chance) to avoid too many requests
      if (Math.random() > 0.9) {
        try {
          await miningService.updateMiningStats(user.id, currentSession.id, {
            hashrate: newStats.hashrate,
            shares_accepted: newStats.sharesAccepted,
            shares_rejected: newStats.sharesRejected,
            rewards: newStats.rewards
          });
        } catch (error) {
          console.error("Error updating mining stats:", error);
        }
      }
    }, 1000);
    
    updateIntervalRef.current = interval;

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
    };
  }, [isActive, currentSession, miningStats, user]);

  const toggleMining = async () => {
    if (!user) {
      toast.error("Please login to start mining");
      return;
    }

    if (isActive) {
      try {
        await miningService.stopMining(user.id, currentSession.id);
        setIsActive(false);
        setCurrentSession(null);
        setProgress(0);
        toast.success("Mining stopped successfully");
      } catch (error) {
        console.error("Error stopping mining:", error);
        toast.error("Failed to stop mining");
      }
    } else {
      setProgress(0);
      
      const session = await miningService.startMining(user.id, {
        initial_hashrate: 45.5
      });
      
      setCurrentSession(session);
      setIsActive(true);
      
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newValue = prev + Math.random() * 5;
          if (newValue >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newValue;
        });
      }, 500);
      
      toast.success("Mining started successfully");
    }
  };

  if (loading || pageLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Loading Mining Dashboard...</h2>
          <Progress value={50} className="w-64 h-2 bg-sphere-card-dark" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="card-gradient">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
            <p className="mb-4">Please login to access the mining dashboard</p>
            <Button onClick={() => navigate("/")} className="bg-sphere-green text-black">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Mining Status</h2>
                <Button
                  className={`${
                    isActive ? "bg-red-500" : "bg-sphere-green"
                  } text-black`}
                  onClick={toggleMining}
                >
                  {isActive ? "Stop Mining" : "Start Mining"}
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Hashrate</span>
                    <span className="text-sphere-green">
                      {isActive ? `${miningStats.hashrate.toFixed(2)} MH/s` : "0.00 MH/s"}
                    </span>
                  </div>
                  <Progress value={isActive ? progress : 0} className="h-2 bg-sphere-card-dark" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Network Difficulty</span>
                    <span className="text-sphere-green">{isActive ? "Medium" : "N/A"}</span>
                  </div>
                  <Progress value={isActive ? 45 : 0} className="h-2 bg-sphere-card-dark" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Efficiency</span>
                    <span className="text-sphere-green">{isActive ? "78%" : "0%"}</span>
                  </div>
                  <Progress value={isActive ? 78 : 0} className="h-2 bg-sphere-card-dark" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Live Performance</h2>
              <div className="h-48 mb-6 bg-sphere-card-dark rounded-md flex items-center justify-center">
                {isActive ? (
                  <div className="h-full w-full p-4">
                    <div className="flex h-full">
                      {Array.from({ length: 24 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="w-full h-full flex items-end"
                        >
                          <div
                            className="w-full bg-sphere-green opacity-70"
                            style={{
                              height: `${
                                isActive
                                  ? Math.min(
                                      5 + Math.floor(Math.random() * 90),
                                      100
                                    )
                                  : 0
                              }%`,
                              transition: "height 1s ease",
                            }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 flex items-center">
                    <ArrowUpDown className="mr-2" />
                    Start mining to view performance metrics
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-sphere-card-dark p-3 rounded-md">
                  <div className="text-gray-400 text-sm mb-1">Share Accepted</div>
                  <div className="text-xl font-medium">
                    {isActive ? miningStats.sharesAccepted : "0"}
                  </div>
                </div>
                <div className="bg-sphere-card-dark p-3 rounded-md">
                  <div className="text-gray-400 text-sm mb-1">Share Rejected</div>
                  <div className="text-xl font-medium">
                    {isActive ? miningStats.sharesRejected : "0"}
                  </div>
                </div>
                <div className="bg-sphere-card-dark p-3 rounded-md">
                  <div className="text-gray-400 text-sm mb-1">Acceptance Rate</div>
                  <div className="text-xl font-medium">
                    {isActive && (miningStats.sharesAccepted + miningStats.sharesRejected) > 0
                      ? `${Math.round(
                          (miningStats.sharesAccepted /
                            (miningStats.sharesAccepted + miningStats.sharesRejected)) *
                            100
                        )}%`
                      : "0%"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="card-gradient">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Estimated Earnings</h2>
              <div className="space-y-4">
                <div className="bg-sphere-card-dark p-3 rounded-md">
                  <div className="text-gray-400 text-sm mb-1">Hourly</div>
                  <div className="text-xl font-medium">
                    {isActive ? `${(miningStats.rewards / 24).toFixed(4)} SPH` : "0.0000 SPH"}
                  </div>
                </div>
                <div className="bg-sphere-card-dark p-3 rounded-md">
                  <div className="text-gray-400 text-sm mb-1">Daily</div>
                  <div className="text-xl font-medium">
                    {isActive ? `${miningStats.rewards.toFixed(4)} SPH` : "0.0000 SPH"}
                  </div>
                </div>
                <div className="bg-sphere-card-dark p-3 rounded-md">
                  <div className="text-gray-400 text-sm mb-1">Weekly</div>
                  <div className="text-xl font-medium">
                    {isActive ? `${(miningStats.rewards * 7).toFixed(4)} SPH` : "0.0000 SPH"}
                  </div>
                </div>
                <div className="bg-sphere-card-dark p-3 rounded-md">
                  <div className="text-gray-400 text-sm mb-1">Monthly</div>
                  <div className="text-xl font-medium">
                    {isActive ? `${(miningStats.rewards * 30).toFixed(4)} SPH` : "0.0000 SPH"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Power Consumption</h2>
              <div className="text-3xl font-bold mb-2">{isActive ? "715W" : "0W"}</div>
              <div className="text-gray-400 text-sm mb-4">Total system power</div>
              <Progress value={isActive ? 72 : 0} className="h-2 bg-sphere-card-dark" />
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-400">Efficiency</span>
                <span className="text-sphere-green">{isActive ? "0.59 H/W" : "0.00 H/W"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mb-8">
        <ReferralSystem 
          userId={user?.id || ""}
          referralCode={referralInfo.referralCode}
          referralCount={referralInfo.referralCount}
          totalBonus={referralInfo.totalBonus}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <HashrateChart isActive={isActive} stats={miningStats} />
        <SharesChart isActive={isActive} stats={miningStats} />
      </div>
    </div>
  );
};

export default MiningPage;
