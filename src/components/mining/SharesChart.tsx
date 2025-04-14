
import { Card, CardContent } from "@/components/ui/card";

interface SharesChartProps {
  isActive: boolean;
  stats?: {
    hashrate: number;
    sharesAccepted: number;
    sharesRejected: number;
    rewards: number;
  };
}

const SharesChart = ({ isActive, stats = { hashrate: 0, sharesAccepted: 0, sharesRejected: 0, rewards: 0 } }: SharesChartProps) => {
  return (
    <Card className="card-gradient">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Shares</h2>
        <div className="h-56 bg-sphere-card-dark rounded-md flex items-end justify-between p-4 space-x-2 relative">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div key={idx} className="h-full flex flex-col justify-end w-full">
              <div
                style={{
                  height: isActive
                    ? `${Math.max(30, Math.min(90, Math.random() * 90))}%`
                    : "0%",
                  transition: "height 0.5s ease",
                }}
                className="w-full bg-sphere-green"
              />
            </div>
          ))}
          {isActive && (
            <div className="absolute top-2 right-2 bg-sphere-card-dark bg-opacity-70 px-2 py-1 rounded text-xs">
              Shares: {stats.sharesAccepted}
            </div>
          )}
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-400">
          <span>0.00</span>
          <span>2.00</span>
          <span>4.00</span>
          <span>6.00</span>
          <span>8.00</span>
          <span>10.00</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SharesChart;
