
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface HashrateChartProps {
  isActive: boolean;
  stats?: {
    hashrate: number;
    sharesAccepted: number;
    sharesRejected: number;
    rewards: number;
  };
}

const HashrateChart = ({ isActive, stats = { hashrate: 0, sharesAccepted: 0, sharesRejected: 0, rewards: 0 } }: HashrateChartProps) => {
  return (
    <Card className="card-gradient">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Hashrate</h2>
          {isActive && (
            <div className="flex items-center px-2 py-1 bg-green-900/30 rounded-full text-green-400 text-xs">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> 
                ACTIVE
              </span>
            </div>
          )}
        </div>
        <div className="h-56 bg-sphere-card-dark rounded-md flex items-end justify-between p-4 space-x-2 relative">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div key={idx} className="h-full flex flex-col justify-end w-full">
              <div
                style={{
                  height: isActive
                    ? `${Math.max(20, Math.min(85, (stats.hashrate / 100) * 100 + Math.random() * 15))}%`
                    : "0%",
                  transition: "height 0.5s ease",
                }}
                className={`w-full ${isActive ? 'bg-sphere-green' : 'bg-gray-700'}`}
              />
            </div>
          ))}
          {isActive && (
            <div className="absolute top-2 right-2 bg-sphere-card-dark bg-opacity-70 px-2 py-1 rounded text-xs">
              {stats.hashrate.toFixed(2)} MH/s
            </div>
          )}
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-400">
          <span>12h ago</span>
          <span>10h ago</span>
          <span>8h ago</span>
          <span>6h ago</span>
          <span>4h ago</span>
          <span>2h ago</span>
          <span>now</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default HashrateChart;
