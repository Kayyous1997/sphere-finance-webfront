import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Cpu, Ram, Network, Activity } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-16">
        <div className="inline-block bg-sphere-green/10 text-sphere-green px-3 py-1 rounded-full text-sm font-medium mb-4">
          Beta
        </div>
        <div className="text-gray-400 mb-4">Testnet Phase 1</div>
        <h1 className="text-5xl font-bold mb-6">
          Join Sphere Finance<br />Testnet Mining
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl">
          Be among the first to experience Sphere's revolutionary P2P lending platform. Register for our testnet, participate in mining activities, and earn rewards.
        </p>
        <div className="flex space-x-4">
          <Link to="/connect">
            <Button className="bg-sphere-green text-black hover:bg-green-400 px-6 py-6 text-lg">
              Connect Wallet
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="card-gradient p-6 rounded-lg">
          <h2 className="text-sphere-green text-3xl font-bold mb-2">TBA</h2>
          <p className="text-gray-400">Total Mining Rewards</p>
        </div>
        <div className="card-gradient p-6 rounded-lg">
          <h2 className="text-sphere-green text-3xl font-bold mb-2">0.00 MH/s</h2>
          <p className="text-gray-400">Network Hashrate</p>
          <p className="text-xs text-gray-500 mt-1">Peak: 0.00 MH/s</p>
        </div>
        <div className="card-gradient p-6 rounded-lg">
          <h2 className="text-sphere-green text-3xl font-bold mb-2">0</h2>
          <p className="text-gray-400">Active Workers</p>
          <p className="text-xs text-gray-500 mt-1">Efficiency: 0%</p>
        </div>
        <div className="card-gradient p-6 rounded-lg">
          <h2 className="text-sphere-green text-3xl font-bold mb-2">0.0000 SPH</h2>
          <p className="text-gray-400">Total Earnings</p>
          <p className="text-xs text-gray-500 mt-1">Pending: 0.0000 SPH</p>
        </div>
      </div>

      <div className="card-gradient rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold mb-4">Connect Wallet to Continue</h2>
        <p className="text-gray-400 mb-6">
          Please connect your wallet to access the testnet registration
        </p>
        <Link to="/connect">
          <Button className="bg-sphere-green text-black hover:bg-green-400">
            Connect Wallet
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <Card className="bg-sphere-card border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="mr-3">
                <Cpu className="text-sphere-green h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">CPU</h3>
                <p className="text-sm text-gray-400">Processor Check</p>
              </div>
              <div className="ml-auto">
                <div className="status-indicator status-success"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-sphere-card border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="mr-3">
                <Ram className="text-yellow-500 h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Memory</h3>
                <p className="text-sm text-gray-400">RAM Check</p>
              </div>
              <div className="ml-auto">
                <div className="status-indicator status-warning"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-sphere-card border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="mr-3">
                <Activity className="text-sphere-green h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">GPU</h3>
                <p className="text-sm text-gray-400">Graphics Check</p>
              </div>
              <div className="ml-auto">
                <div className="status-indicator status-success"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-sphere-card border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="mr-3">
                <Network className="text-sphere-green h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Network</h3>
                <p className="text-sm text-gray-400">Connection Check</p>
              </div>
              <div className="ml-auto">
                <div className="status-indicator status-success"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-16">
        <div className="card-gradient rounded-lg p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h2 className="text-xl font-bold mb-2">Mining Controls</h2>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <select className="w-full bg-sphere-card-dark border border-gray-800 rounded-md py-2 px-4 text-white appearance-none">
                  <option>Select Worker</option>
                  <option>Worker 1</option>
                  <option>Worker 2</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div className="relative w-full md:w-64">
                <select className="w-full bg-sphere-card-dark border border-gray-800 rounded-md py-2 px-4 text-white appearance-none">
                  <option>Select Pool</option>
                  <option>Pool 1</option>
                  <option>Pool 2</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <Link to="/mining">
                <Button className="w-full md:w-auto bg-sphere-green text-black hover:bg-green-400">
                  Start Mining
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card-gradient rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Network Hashrate</h3>
            <div className="p-1 rounded bg-sphere-card-dark">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#00E676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="mb-1">
            <span className="text-3xl font-bold">0.00 MH/s</span>
          </div>
          <div className="text-sm text-gray-400">
            Peak: <span className="text-sphere-green">0.00 MH/s</span>
          </div>
        </div>
        <div className="card-gradient rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Active Workers</h3>
            <div className="p-1 rounded bg-sphere-card-dark">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 19H20M4 5H20M4 12H20" stroke="#00E676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="mb-1">
            <span className="text-3xl font-bold">0</span>
          </div>
          <div className="text-sm text-gray-400">
            Efficiency: <span className="text-sphere-green">0%</span>
          </div>
        </div>
        <div className="card-gradient rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Total Earnings</h3>
            <div className="p-1 rounded bg-sphere-card-dark">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M18 10L12 4M6 10L12 4" stroke="#00E676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="mb-1">
            <span className="text-3xl font-bold">0.0000 SPH</span>
          </div>
          <div className="text-sm text-gray-400">
            Pending: <span className="text-sphere-green">0.0000 SPH</span>
          </div>
        </div>
        <div className="card-gradient rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Power Efficiency</h3>
            <div className="p-1 rounded bg-sphere-card-dark">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#00E676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="mb-1">
            <span className="text-3xl font-bold">NaN H/W</span>
          </div>
          <div className="text-sm text-gray-400">
            Total Power: <span className="text-sphere-green">715W</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
