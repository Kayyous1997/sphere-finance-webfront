
import { DollarSign, PieChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HomeTokenomicsSection = () => {
  const tokenData = [
    { name: "Ecosystem Rewards", percentage: 35, color: "#9b87f5" },
    { name: "Project Development", percentage: 25, color: "#7E69AB" },
    { name: "Community Mining", percentage: 20, color: "#6E59A5" },
    { name: "Team & Advisors", percentage: 10, color: "#5A4890" },
    { name: "Marketing", percentage: 5, color: "#4D3B80" },
    { name: "Liquidity Reserves", percentage: 5, color: "#3A2970" }
  ];

  return (
    <section id="tokenomics" className="container mx-auto px-4 py-16 md:py-24 bg-sphere-dark">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-flex items-center">
          <DollarSign className="mr-2 h-8 w-8 text-sphere-green" />
          Tokenomics
        </h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Our token economics are designed for long-term sustainability, community rewards, and ecosystem growth.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div>
          <h3 className="text-2xl font-bold mb-6">SPH Token Allocation</h3>
          
          <div className="space-y-6">
            {tokenData.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{item.name}</span>
                  <span className="font-medium">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <h4 className="text-xl font-medium mb-4">Token Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-sphere-card p-4 rounded-lg">
                <p className="text-sm text-gray-400">Total Supply</p>
                <p className="text-xl font-bold">100,000,000 SPH</p>
              </div>
              <div className="bg-sphere-card p-4 rounded-lg">
                <p className="text-sm text-gray-400">Initial Circulating</p>
                <p className="text-xl font-bold">15,000,000 SPH</p>
              </div>
              <div className="bg-sphere-card p-4 rounded-lg">
                <p className="text-sm text-gray-400">Initial Market Cap</p>
                <p className="text-xl font-bold">$5,250,000</p>
              </div>
              <div className="bg-sphere-card p-4 rounded-lg">
                <p className="text-sm text-gray-400">Initial Token Price</p>
                <p className="text-xl font-bold">$0.35</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <Card className="card-gradient overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <PieChart className="mr-2 h-6 w-6 text-sphere-green" />
                Token Utility & Benefits
              </h3>
              
              <div className="space-y-4">
                <div className="bg-black/20 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">Mining Rewards</h4>
                  <p className="text-gray-300">Earn SPH tokens through the mining program based on computational contributions.</p>
                </div>
                
                <div className="bg-black/20 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">Governance Rights</h4>
                  <p className="text-gray-300">Participate in platform decisions and vote on improvement proposals.</p>
                </div>
                
                <div className="bg-black/20 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">Fee Discounts</h4>
                  <p className="text-gray-300">Reduced platform fees for token holders based on staked amount.</p>
                </div>
                
                <div className="bg-black/20 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">Premium Features</h4>
                  <p className="text-gray-300">Access advanced platform features and exclusive mining pools.</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-sphere-green/10 border border-sphere-green/20 rounded-lg">
                <h4 className="font-bold text-sphere-green mb-2">Vesting Schedule</h4>
                <p className="text-gray-300">Team tokens are subject to a 2-year vesting schedule with a 6-month cliff. Ecosystem rewards are distributed on a monthly basis according to community participation.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HomeTokenomicsSection;
