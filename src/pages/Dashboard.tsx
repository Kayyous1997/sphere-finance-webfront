
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthHero from "@/components/auth/AuthHero";

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-16">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-sphere-green to-blue-500">
            The Future of Decentralized Finance
          </h1>
          <p className="text-xl text-gray-300">
            Secure, transparent, and innovative blockchain solutions for the modern world.
          </p>
        </div>
        
        <AuthHero />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Sphere Finance?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-sphere-card border-gray-800">
            <CardHeader>
              <CardTitle>Secure Mining</CardTitle>
              <CardDescription>Industry-leading security protocols</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Our platform uses advanced cryptographic security to ensure your assets are always protected.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-sphere-card border-gray-800">
            <CardHeader>
              <CardTitle>High Yields</CardTitle>
              <CardDescription>Maximize your investment</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                With optimized mining algorithms, we help you achieve the highest possible returns on your investment.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-sphere-card border-gray-800">
            <CardHeader>
              <CardTitle>Easy to Use</CardTitle>
              <CardDescription>No technical experience required</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Our intuitive platform makes it simple for anyone to get started with cryptocurrency mining.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
