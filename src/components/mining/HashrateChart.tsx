
import { Card, CardContent } from "@/components/ui/card";

const HashrateChart = ({ isActive }: { isActive: boolean }) => {
  return (
    <Card className="card-gradient">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Hashrate</h2>
        <div className="h-56 bg-sphere-card-dark rounded-md flex items-end justify-between p-4 space-x-2">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div key={idx} className="h-full flex flex-col justify-end w-full">
              <div
                style={{
                  height: isActive
                    ? `${Math.max(5, Math.min(20, Math.random() * 20))}%`
                    : "0%",
                  transition: "height 0.5s ease",
                }}
                className="w-full bg-sphere-green"
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-400">
          <span>0.00</span>
          <span>1.00</span>
          <span>2.00</span>
          <span>3.00</span>
          <span>4.00</span>
          <span>5.00</span>
          <span>6.00</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default HashrateChart;
