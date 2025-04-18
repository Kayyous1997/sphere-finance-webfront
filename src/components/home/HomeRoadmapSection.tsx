
import { Calendar, Circuit, ChevronRight } from "lucide-react";

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
      <div className="text-center mb-12 animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-flex items-center gap-3">
          <Circuit className="h-8 w-8 text-sphere-green animate-pulse" />
          Project Roadmap
          <Circuit className="h-8 w-8 text-sphere-green animate-pulse" />
        </h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Our development timeline outlines the key milestones and features planned for Sphere Finance's evolution.
        </p>
      </div>

      <div className="relative">
        {/* Timeline line with glow effect */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sphere-green via-sphere-light-green to-sphere-green transform -translate-x-1/2 animate-glow"></div>
        
        <div className="space-y-12">
          {roadmapItems.map((item, index) => (
            <div key={index} className="relative group">
              <div className="md:grid md:grid-cols-2 gap-8 items-center">
                {/* Timeline marker with pulse effect */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-sphere-green animate-pulse"></div>
                  <div className="absolute w-6 h-6 rounded-full border border-sphere-light-green animate-ping"></div>
                </div>
                
                {/* Content on alternating sides */}
                {index % 2 === 0 ? (
                  <>
                    <div className="md:text-right md:pr-12 group">
                      <div className="glass-card p-6 transition-all duration-300 group-hover:scale-105 group-hover:bg-black/60 group-hover:border-sphere-green">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-3 transition-colors ${
                          item.status === 'upcoming' ? 'bg-sphere-green/20 text-sphere-green' : 'bg-blue-900/50 text-blue-400'
                        }`}>
                          <ChevronRight className="h-4 w-4" />
                          {item.status}
                        </div>
                        <h3 className="text-xl font-bold text-sphere-green">{item.quarter}</h3>
                        <h4 className="text-2xl font-bold mb-4 text-white">{item.title}</h4>
                        <ul className="space-y-2">
                          {item.items.map((listItem, i) => (
                            <li key={i} className="text-gray-300 transition-transform hover:translate-x-1">{listItem}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="hidden md:block"></div>
                  </>
                ) : (
                  <>
                    <div className="hidden md:block"></div>
                    <div className="md:pl-12 group">
                      <div className="glass-card p-6 transition-all duration-300 group-hover:scale-105 group-hover:bg-black/60 group-hover:border-sphere-green">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-3 transition-colors ${
                          item.status === 'upcoming' ? 'bg-sphere-green/20 text-sphere-green' : 'bg-blue-900/50 text-blue-400'
                        }`}>
                          <ChevronRight className="h-4 w-4" />
                          {item.status}
                        </div>
                        <h3 className="text-xl font-bold text-sphere-green">{item.quarter}</h3>
                        <h4 className="text-2xl font-bold mb-4 text-white">{item.title}</h4>
                        <ul className="space-y-2">
                          {item.items.map((listItem, i) => (
                            <li key={i} className="text-gray-300 transition-transform hover:translate-x-1">{listItem}</li>
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
