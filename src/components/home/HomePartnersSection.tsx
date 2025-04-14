
import { Handshake } from "lucide-react";

const HomePartnersSection = () => {
  const partners = [
    {
      name: "BlockChain Labs",
      logo: "/lovable-uploads/4543ce24-37c0-4f88-ae42-12be997f85d0.png",
      type: "Technology Partner"
    },
    {
      name: "Crypto Valley",
      logo: "/lovable-uploads/4543ce24-37c0-4f88-ae42-12be997f85d0.png",
      type: "Investment Partner"
    },
    {
      name: "DeFi Alliance",
      logo: "/lovable-uploads/4543ce24-37c0-4f88-ae42-12be997f85d0.png",
      type: "Strategic Partner"
    },
    {
      name: "TechNode",
      logo: "/lovable-uploads/4543ce24-37c0-4f88-ae42-12be997f85d0.png",
      type: "Infrastructure Partner"
    },
    {
      name: "Quantum Finance",
      logo: "/lovable-uploads/4543ce24-37c0-4f88-ae42-12be997f85d0.png",
      type: "Exchange Partner"
    },
    {
      name: "BlockSec",
      logo: "/lovable-uploads/4543ce24-37c0-4f88-ae42-12be997f85d0.png",
      type: "Security Partner"
    }
  ];

  return (
    <section id="partners" className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-flex items-center">
          <Handshake className="mr-2 h-8 w-8 text-sphere-green" />
          Our Partners
        </h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          We collaborate with industry leaders to build a stronger ecosystem and accelerate innovation.
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {partners.map((partner, index) => (
          <div key={index} className="bg-sphere-card-dark border border-gray-700 hover:border-sphere-green rounded-lg p-6 transition-all duration-300 flex flex-col items-center text-center hover:transform hover:-translate-y-1">
            <div className="bg-black/30 p-4 rounded-lg mb-4 w-24 h-24 flex items-center justify-center">
              <img 
                src={partner.logo} 
                alt={`${partner.name} logo`} 
                className="w-16 h-16 object-contain"
              />
            </div>
            <h3 className="text-xl font-bold">{partner.name}</h3>
            <p className="text-sm text-gray-400 mt-1">{partner.type}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-16 bg-gradient-to-r from-sphere-card to-sphere-card-dark p-8 rounded-lg text-center">
        <h3 className="text-2xl font-bold mb-4">Become a Partner</h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Interested in partnering with Sphere Finance? We're always looking for strategic collaborations to 
          expand our ecosystem and create mutual value.
        </p>
        <button className="bg-sphere-green text-black px-6 py-3 rounded-lg font-medium hover:bg-sphere-blue transition-colors">
          Contact Our Partnership Team
        </button>
      </div>
    </section>
  );
};

export default HomePartnersSection;
