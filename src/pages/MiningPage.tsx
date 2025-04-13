
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpDown, Cpu, MemoryStick, HardDrive, Activity } from "lucide-react";
import { useState } from "react";
import HashrateChart from "@/components/mining/HashrateChart";
import SharesChart from "@/components/mining/SharesChart";
import WorkersTable from "@/components/mining/WorkersTable";
import MiningPools from "@/components/mining/MiningPools";

const MiningPage = () => {
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggleMining = () => {
    setIsActive(!isActive);
    
    if (!isActive) {
      setProgress(0);
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
                    <span className="text-sphere-green">{isActive ? "0.42 MH/s" : "0.00 MH/s"}</span>
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
                  <div className="text-xl font-medium">{isActive ? "24" : "0"}</div>
                </div>
                <div className="bg-sphere-card-dark p-3 rounded-md">
                  <div className="text-gray-400 text-sm mb-1">Share Rejected</div>
                  <div className="text-xl font-medium">{isActive ? "2" : "0"}</div>
                </div>
                <div className="bg-sphere-card-dark p-3 rounded-md">
                  <div className="text-gray-400 text-sm mb-1">Acceptance Rate</div>
                  <div className="text-xl font-medium">{isActive ? "92%" : "0%"}</div>
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
                  <div className="text-xl font-medium">{isActive ? "0.0042 SPH" : "0.0000 SPH"}</div>
                </div>
                <div className="bg-sphere-card-dark p-3 rounded-md">
                  <div className="text-gray-400 text-sm mb-1">Daily</div>
                  <div className="text-xl font-medium">{isActive ? "0.1008 SPH" : "0.0000 SPH"}</div>
                </div>
                <div className="bg-sphere-card-dark p-3 rounded-md">
                  <div className="text-gray-400 text-sm mb-1">Weekly</div>
                  <div className="text-xl font-medium">{isActive ? "0.7056 SPH" : "0.0000 SPH"}</div>
                </div>
                <div className="bg-sphere-card-dark p-3 rounded-md">
                  <div className="text-gray-400 text-sm mb-1">Monthly</div>
                  <div className="text-xl font-medium">{isActive ? "3.0240 SPH" : "0.0000 SPH"}</div>
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
      
      {/* New Hashrate and Shares charts section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <HashrateChart isActive={isActive} />
        <SharesChart isActive={isActive} />
      </div>
      
      {/* Workers Table */}
      <div className="mb-8">
        <WorkersTable isActive={isActive} />
      </div>
      
      {/* Mining Pools */}
      <div className="mb-8">
        <MiningPools />
      </div>
    </div>
  );
};

export default MiningPage;
