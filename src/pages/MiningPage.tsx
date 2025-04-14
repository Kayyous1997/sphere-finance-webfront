
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpDown, Cpu, MemoryStick, HardDrive, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import HashrateChart from "@/components/mining/HashrateChart";
import SharesChart from "@/components/mining/SharesChart";
import WorkersTable from "@/components/mining/WorkersTable";
import MiningPools from "@/components/mining/MiningPools";
import HowMiningWorks from "@/components/mining/HowMiningWorks";
import StrategyTips from "@/components/mining/StrategyTips";
import { useAuth } from "@/contexts/AuthContext";
import { miningService, MiningSession, MiningWorker } from "@/services/miningService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const MiningPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSession, setCurrentSession] = useState<MiningSession | null>(null);
  const [workers, setWorkers] = useState<MiningWorker[]>([]);
  const [miningStats, setMiningStats] = useState({
    hashrate: 0,
    sharesAccepted: 0,
    sharesRejected: 0,
    rewards: 0
  });

  // Load active session and workers on mount
  useEffect(() => {
    if (!user) {
      toast.error("Please login to access the mining dashboard");
      navigate("/");
      return;
    }

    const loadSessionAndWorkers = async () => {
      try {
        // Get active session
        const session = await miningService.getActiveMiningSession(user.id);
        if (session) {
          setCurrentSession(session);
          setIsActive(true);
          setProgress(100); // Session already active
          setMiningStats({
            hashrate: session.total_hashrate,
            sharesAccepted: session.shares_accepted,
            sharesRejected: session.shares_rejected,
            rewards: session.rewards_earned
          });
        }

        // Get workers
        const userWorkers = await miningService.getUserWorkers(user.id);
        setWorkers(userWorkers);
      } catch (error) {
        console.error("Error loading session data:", error);
      }
    };

    loadSessionAndWorkers();
  }, [user, navigate]);

  // Mining simulation interval
  useEffect(() => {
    if (!isActive || !currentSession || !user) return;

    let interval = setInterval(async () => {
      // Simulate mining activity with random fluctuations
      const hashrate = miningStats.hashrate + (Math.random() * 0.1 - 0.05);
      const sharesAccepted = miningStats.sharesAccepted + (Math.random() > 0.8 ? 1 : 0);
      const sharesRejected = miningStats.sharesRejected + (Math.random() > 0.95 ? 1 : 0);
      const rewards = miningStats.rewards + (Math.random() * 0.0001);

      const newStats = {
        hashrate: Number(hashrate.toFixed(2)),
        sharesAccepted: Math.floor(sharesAccepted),
        sharesRejected: Math.floor(sharesRejected),
        rewards: Number(rewards.toFixed(4))
      };

      setMiningStats(newStats);

      // Update session in database every 10 seconds
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

    return () => clearInterval(interval);
  }, [isActive, currentSession, miningStats, user]);

  const toggleMining = async () => {
    if (!user) {
      toast.error("Please login to start mining");
      return;
    }

    if (isActive) {
      // Stop mining
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
      // Start mining
      try {
        setProgress(0);
        
        // Use active workers for this session
        const activeWorkers = workers.filter(w => w.status === 'online');
        
        const session = await miningService.startMining(user.id, {
          workers: activeWorkers,
          initial_hashrate: activeWorkers.reduce((sum, w) => sum + w.hashrate, 0)
        });
        
        setCurrentSession(session);
        setIsActive(true);
        
        // Simulate progress bar filling up
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
      } catch (error) {
        console.error("Error starting mining:", error);
        toast.error("Failed to start mining");
      }
    }
  };

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
              <h2 className="text-xl font-bold mb-4">Worker Details</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Cpu className="w-5 h-5 mr-3 text-sphere-green" />
                  <div>
                    <div className="text-sm text-gray-400">CPU</div>
                    <div className="font-medium">AMD Ryzen 9 5900X</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <MemoryStick className="w-5 h-5 mr-3 text-sphere-green" />
                  <div>
                    <div className="text-sm text-gray-400">Memory</div>
                    <div className="font-medium">32GB DDR4-3600</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <HardDrive className="w-5 h-5 mr-3 text-sphere-green" />
                  <div>
                    <div className="text-sm text-gray-400">Storage</div>
                    <div className="font-medium">1TB NVMe SSD</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Activity className="w-5 h-5 mr-3 text-sphere-green" />
                  <div>
                    <div className="text-sm text-gray-400">GPU</div>
                    <div className="font-medium">RTX 3080 Ti</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
      
      {/* How Mining Works Section */}
      <div className="mb-8">
        <HowMiningWorks />
      </div>
      
      {/* Strategy Tips Section */}
      <div className="mb-8">
        <StrategyTips />
      </div>
      
      {/* Hashrate and Shares charts section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <HashrateChart isActive={isActive} stats={miningStats} />
        <SharesChart isActive={isActive} stats={miningStats} />
      </div>
      
      {/* Workers Table */}
      <div className="mb-8">
        <WorkersTable 
          isActive={isActive} 
          workers={workers}
          onAddWorker={async (newWorker) => {
            if (!user) return;
            try {
              const created = await miningService.createWorker(user.id, newWorker);
              setWorkers([...workers, created]);
              toast.success("Worker added successfully");
            } catch (error) {
              console.error("Error adding worker:", error);
            }
          }}
          onUpdateWorker={async (workerId, updates) => {
            if (!user) return;
            try {
              await miningService.updateWorker(user.id, workerId, updates);
              setWorkers(workers.map(w => w.id === workerId ? {...w, ...updates} : w));
            } catch (error) {
              console.error("Error updating worker:", error);
            }
          }}
          onDeleteWorker={async (workerId) => {
            if (!user) return;
            try {
              await miningService.deleteWorker(user.id, workerId);
              setWorkers(workers.filter(w => w.id !== workerId));
              toast.success("Worker deleted successfully");
            } catch (error) {
              console.error("Error deleting worker:", error);
            }
          }}
        />
      </div>
      
      {/* Mining Pools */}
      <div className="mb-8">
        <MiningPools />
      </div>
    </div>
  );
};

export default MiningPage;
