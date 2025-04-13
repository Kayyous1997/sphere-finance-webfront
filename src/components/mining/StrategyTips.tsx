
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const StrategyTips = () => {
  return (
    <Card className="card-gradient">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-sphere-green p-2 rounded-md">
            <Lightbulb className="h-5 w-5 text-black" />
          </div>
          <h2 className="text-2xl font-bold">Strategy Tips</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Optimal Pairing */}
          <Card className="bg-sphere-card-dark">
            <CardContent className="p-5">
              <h3 className="text-xl font-bold mb-4">Optimal Pairing</h3>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-sphere-green mt-2 mr-2"></div>
                  <span className="text-gray-300">Match specialized workers with their preferred pools for maximum efficiency</span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-sphere-green mt-2 mr-2"></div>
                  <span className="text-gray-300">Use Quantum workers during business hours for peak performance</span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-sphere-green mt-2 mr-2"></div>
                  <span className="text-gray-300">Deploy hybrid workers when market conditions are uncertain</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          {/* Maximizing Earnings */}
          <Card className="bg-sphere-card-dark">
            <CardContent className="p-5">
              <h3 className="text-xl font-bold mb-4">Maximizing Earnings</h3>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-sphere-green mt-2 mr-2"></div>
                  <span className="text-gray-300">Monitor pool performance patterns and adjust strategy accordingly</span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-sphere-green mt-2 mr-2"></div>
                  <span className="text-gray-300">Find the sweet spot between power efficiency and hashrate</span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-sphere-green mt-2 mr-2"></div>
                  <span className="text-gray-300">Switch pools based on their time-of-day efficiency patterns</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategyTips;
