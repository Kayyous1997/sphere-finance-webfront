
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AuthHero from "@/components/auth/AuthHero";
import { Link } from "react-router-dom";
import HomeAboutSection from "@/components/home/HomeAboutSection";
import HomeOverviewSection from "@/components/home/HomeOverviewSection";
import HomeRoadmapSection from "@/components/home/HomeRoadmapSection";
import HomeTokenomicsSection from "@/components/home/HomeTokenomicsSection";
import HomePartnersSection from "@/components/home/HomePartnersSection";

const Index = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-sphere-green to-purple-400">
              The Future of Decentralized Finance
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Sphere Finance is revolutionizing DeFi with innovative mining solutions, 
              transparent tokenomics, and a community-first approach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-sphere-green text-black hover:bg-green-400" asChild>
                <Link to="/mining">Start Mining</Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="#tokenomics">Explore Tokenomics</a>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <AuthHero />
          </div>
        </div>
      </section>
      
      <Separator className="bg-gray-800" />
      
      {/* About Section */}
      <HomeAboutSection />
      
      <Separator className="bg-gray-800" />
      
      {/* Project Overview */}
      <HomeOverviewSection />
      
      <Separator className="bg-gray-800" />
      
      {/* Roadmap */}
      <HomeRoadmapSection />
      
      <Separator className="bg-gray-800" />
      
      {/* Tokenomics */}
      <HomeTokenomicsSection />
      
      <Separator className="bg-gray-800" />
      
      {/* Partners */}
      <HomePartnersSection />
    </div>
  );
};

export default Index;
