
import { Card, CardContent } from "@/components/ui/card";
import { Info, Tv, Cpu, Zap } from "lucide-react";

const HowMiningWorks = () => {
  return (
    <Card className="card-gradient">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-sphere-green p-2 rounded-md">
            <Info className="h-5 w-5 text-black" />
          </div>
          <h2 className="text-2xl font-bold">How Mining Works</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mining Pools */}
          <Card className="bg-sphere-card-dark">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-sphere-green p-2 rounded-md">
                  <Tv className="h-5 w-5 text-black" />
                </div>
                <h3 className="text-xl font-bold">Mining Pools</h3>
              </div>
              
              <p className="text-sm text-gray-400 mb-4">Three specialized pools available:</p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-sphere-green mt-2 mr-2"></div>
                  <div>
                    <span className="font-semibold">Quantum Hash:</span>
                    <span className="text-gray-400 text-sm"> Peak performance during business hours (9-5)</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-sphere-green mt-2 mr-2"></div>
                  <div>
                    <span className="font-semibold">Neural Mesh:</span>
                    <span className="text-gray-400 text-sm"> Wave-pattern efficiency with steady returns</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-sphere-green mt-2 mr-2"></div>
                  <div>
                    <span className="font-semibold">Chaos Matrix:</span>
                    <span className="text-gray-400 text-sm"> High-risk, high-reward volatility</span>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          {/* Mining Workers */}
          <Card className="bg-sphere-card-dark">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-sphere-green p-2 rounded-md">
                  <Cpu className="h-5 w-5 text-black" />
                </div>
                <h3 className="text-xl font-bold">Mining Workers</h3>
              </div>
              
              <p className="text-sm text-gray-400 mb-4">Seven worker types with unique capabilities:</p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-sphere-green mt-2 mr-2"></div>
                  <div>
                    <span className="font-semibold">Specialized workers:</span>
                    <span className="text-gray-400 text-sm"> 30% bonus with matching pools</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-sphere-green mt-2 mr-2"></div>
                  <div>
                    <span className="font-semibold">Hybrid workers:</span>
                    <span className="text-gray-400 text-sm"> 10% bonus with any pool</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-sphere-green mt-2 mr-2"></div>
                  <div>
                    <span className="font-semibold">Power efficiency:</span>
                    <span className="text-gray-400 text-sm"> Different ratings affect earnings</span>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          {/* Mining Performance */}
          <Card className="bg-sphere-card-dark">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-sphere-green p-2 rounded-md">
                  <Zap className="h-5 w-5 text-black" />
                </div>
                <h3 className="text-xl font-bold">Mining Performance</h3>
              </div>
              
              <p className="text-sm text-gray-400 mb-4">Dynamic performance factors:</p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-sphere-green mt-2 mr-2"></div>
                  <div>
                    <span className="font-semibold">Time-based:</span>
                    <span className="text-gray-400 text-sm"> Pool algorithm efficiency varies by time</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-sphere-green mt-2 mr-2"></div>
                  <div>
                    <span className="font-semibold">Specialization:</span>
                    <span className="text-gray-400 text-sm"> Worker type affects mining rate</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-sphere-green mt-2 mr-2"></div>
                  <div>
                    <span className="font-semibold">Environment:</span>
                    <span className="text-gray-400 text-sm"> External factors influence performance</span>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default HowMiningWorks;
