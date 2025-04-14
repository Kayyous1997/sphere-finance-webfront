
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const HomeAboutSection = () => {
  return (
    <section id="about" className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-flex items-center">
          <BookOpen className="mr-2 h-8 w-8 text-sphere-green" />
          About Sphere Finance
        </h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Building the next generation of decentralized finance tools to empower users worldwide.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="card-gradient">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="mb-4 text-gray-300">
              Sphere Finance aims to democratize finance by providing accessible, 
              transparent, and efficient decentralized financial services to everyone, 
              regardless of geographical boundaries or socioeconomic status.
            </p>
            <Button variant="link" className="p-0 flex items-center text-sphere-green">
              Learn more <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-gradient">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="mb-4 text-gray-300">
              Creating a world where financial freedom is accessible to all, 
              powered by blockchain technology and user-centric design. We envision 
              a future where traditional financial barriers are eliminated.
            </p>
            <Button variant="link" className="p-0 flex items-center text-sphere-green">
              Learn more <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-gradient">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold mb-4">Core Values</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-sphere-green text-black flex items-center justify-center mr-2 mt-0.5">1</div>
                <span>Transparency in all operations</span>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-sphere-green text-black flex items-center justify-center mr-2 mt-0.5">2</div>
                <span>Community-driven governance</span>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-sphere-green text-black flex items-center justify-center mr-2 mt-0.5">3</div>
                <span>Security and reliability</span>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-sphere-green text-black flex items-center justify-center mr-2 mt-0.5">4</div>
                <span>Innovation at the core</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default HomeAboutSection;
