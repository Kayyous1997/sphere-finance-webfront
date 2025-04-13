
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

type Pool = {
  id: string;
  name: string;
  status: "active" | "inactive";
  url: string;
  algorithm: string;
  fee: string;
  difficulty: string;
  minPayout: string;
};

const pools: Pool[] = [
  {
    id: "1",
    name: "Quantum Surge Pool",
    status: "active",
    url: "quantum.kaleido.network:3333",
    algorithm: "Quantum Hash",
    fee: "1%",
    difficulty: "2.5",
    minPayout: "0.1 KLD",
  },
  {
    id: "2",
    name: "Neural Network Pool",
    status: "active",
    url: "neural.kaleido.network:3334",
    algorithm: "Neural Mesh",
    fee: "0.8%",
    difficulty: "2",
    minPayout: "0.05 KLD",
  },
  {
    id: "3",
    name: "Chaos Matrix Pool",
    status: "active",
    url: "chaos.kaleido.network:3335",
    algorithm: "Chaos Matrix",
    fee: "1.2%",
    difficulty: "3",
    minPayout: "0.15 KLD",
  },
];

const MiningPools = () => {
  return (
    <Card className="card-gradient">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Mining Pools</h2>
          <Button className="bg-sphere-green text-black hover:bg-green-400">
            <Plus className="mr-2 h-4 w-4" /> Add Pool
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pools.map((pool) => (
            <div key={pool.id} className="bg-sphere-card-dark rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{pool.name}</h3>
                <span className="bg-sphere-green bg-opacity-20 text-sphere-green text-xs px-2 py-1 rounded-full">
                  {pool.status}
                </span>
              </div>
              
              <div className="mt-4 mb-2">
                <div className="text-gray-400 text-xs">URL</div>
                <div className="text-sm font-mono">{pool.url}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-gray-400 text-xs">Algorithm</div>
                  <div>{pool.algorithm}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Fee</div>
                  <div>{pool.fee}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-gray-400 text-xs">Difficulty</div>
                  <div>{pool.difficulty}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Min. Payout</div>
                  <div>{pool.minPayout}</div>
                </div>
              </div>
              
              <Button className="w-full mt-4 bg-sphere-green text-black hover:bg-green-400">
                Connect
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MiningPools;
