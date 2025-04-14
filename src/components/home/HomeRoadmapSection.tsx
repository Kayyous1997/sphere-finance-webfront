
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HomeRoadmapSection = () => {
  const roadmapItems = [
    {
      quarter: "Q2 2025",
      title: "Platform Launch",
      status: "upcoming",
      items: [
        "Initial testnet deployment",
        "Mining protocol alpha release",
        "Community building initiatives"
      ]
    },
    {
      quarter: "Q3 2025",
      title: "Expansion Phase",
      status: "upcoming",
      items: [
        "Token launch on major exchanges",
        "Mobile application beta release",
        "Enhanced mining pools implementation"
      ]
    },
    {
      quarter: "Q4 2025",
      title: "Ecosystem Growth",
      status: "planned",
      items: [
        "Cross-chain interoperability integration",
        "DAO governance implementation",
        "Developer grants program launch"
      ]
    },
    {
      quarter: "Q1 2026",
      title: "Advanced Features",
      status: "planned",
      items: [
        "Layer 2 scaling solutions",
        "AI-powered mining optimization",
        "Enterprise partnerships program"
      ]
    }
  ];

  return (
    <section id="roadmap" className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-flex items-center">
          <Calendar className="mr-2 h-8 w-8 text-sphere-green" />
          Project Roadmap
        </h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Our development timeline outlines the key milestones and features planned for Sphere Finance's evolution.
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-sphere-green transform -translate-x-1/2"></div>
        
        <div className="space-y-12">
          {roadmapItems.map((item, index) => (
            <div key={index} className="relative">
              <div className="md:grid md:grid-cols-2 gap-8 items-center">
                {/* Timeline marker */}
                <div className="hidden md:block absolute left-1/2 top-1/2 w-4 h-4 rounded-full bg-sphere-green transform -translate-x-1/2 -translate-y-1/2"></div>
                
                {/* Content on alternating sides */}
                {index % 2 === 0 ? (
                  <>
                    <div className="md:text-right md:pr-12">
                      <div className="bg-gradient-to-r from-sphere-card to-sphere-card-dark p-6 rounded-lg">
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                          item.status === 'upcoming' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-blue-900/50 text-blue-400'
                        }`}>
                          {item.status}
                        </div>
                        <h3 className="text-xl font-bold text-sphere-green">{item.quarter}</h3>
                        <h4 className="text-2xl font-bold mb-4">{item.title}</h4>
                        <ul className="space-y-2">
                          {item.items.map((listItem, i) => (
                            <li key={i} className="text-gray-300">{listItem}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="hidden md:block"></div>
                  </>
                ) : (
                  <>
                    <div className="hidden md:block"></div>
                    <div className="md:pl-12">
                      <div className="bg-gradient-to-r from-sphere-card to-sphere-card-dark p-6 rounded-lg">
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                          item.status === 'upcoming' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-blue-900/50 text-blue-400'
                        }`}>
                          {item.status}
                        </div>
                        <h3 className="text-xl font-bold text-sphere-green">{item.quarter}</h3>
                        <h4 className="text-2xl font-bold mb-4">{item.title}</h4>
                        <ul className="space-y-2">
                          {item.items.map((listItem, i) => (
                            <li key={i} className="text-gray-300">{listItem}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeRoadmapSection;
