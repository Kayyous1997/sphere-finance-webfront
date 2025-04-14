
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

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
  // Generate sample data for the chart based on if mining is active
  const generateChartData = () => {
    const data = [];
    for (let i = 0; i < 12; i++) {
      data.push({
        time: i,
        shares: isActive 
          ? Math.max(0, Math.floor((stats.sharesAccepted / 12) * (1 + Math.random() * 0.5 - 0.25)))
          : 0
      });
    }
    return data;
  };

  const chartData = generateChartData();

  return (
    <Card className="card-gradient">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Shares</h2>
          {isActive && (
            <div className="bg-sphere-card-dark bg-opacity-70 px-3 py-1.5 rounded text-sm">
              <span className="text-sphere-green">{stats.sharesAccepted}</span>
              <span className="text-gray-400 mx-1">accepted</span>
              <span className="text-red-400 ml-2">{stats.sharesRejected || 0}</span>
              <span className="text-gray-400 ml-1">rejected</span>
            </div>
          )}
        </div>
        
        <div className="h-56 bg-sphere-card-dark rounded-md">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="time" tick={false} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-black bg-opacity-80 p-2 rounded text-xs">
                        <p className="text-white">{`Shares: ${payload[0].value}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="shares" 
                fill="#22c55e" 
                radius={[4, 4, 0, 0]}
                animationDuration={500}
              />
            </BarChart>
          </ResponsiveContainer>
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
