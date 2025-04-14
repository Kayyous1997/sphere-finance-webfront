
import { LayoutDashboard, Shield, Zap, Cpu } from "lucide-react";

const HomeOverviewSection = () => {
  return (
    <section id="overview" className="container mx-auto px-4 py-16 md:py-24 bg-sphere-dark">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-flex items-center">
          <LayoutDashboard className="mr-2 h-8 w-8 text-sphere-green" />
          Project Overview
        </h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Sphere Finance combines multiple DeFi components into a unified ecosystem, creating a comprehensive platform for users.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
        <div className="flex">
          <div className="flex-shrink-0 mr-6">
            <div className="w-16 h-16 bg-sphere-card-dark rounded-full flex items-center justify-center">
              <Cpu className="h-8 w-8 text-sphere-green" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Mining Ecosystem</h3>
            <p className="text-gray-300">
              Our innovative mining protocol allows users to mine tokens using a proof-of-stake system 
              that's environmentally friendly and accessible to users without specialized hardware.
              Stake your assets and earn passive income through our optimized mining pools.
            </p>
          </div>
        </div>
        
        <div className="flex">
          <div className="flex-shrink-0 mr-6">
            <div className="w-16 h-16 bg-sphere-card-dark rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-sphere-green" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Security Framework</h3>
            <p className="text-gray-300">
              Security is our top priority. Sphere Finance implements advanced encryption, 
              multi-signature authentication, and regular security audits to ensure your assets 
              remain safe while participating in our ecosystem.
            </p>
          </div>
        </div>
        
        <div className="flex">
          <div className="flex-shrink-0 mr-6">
            <div className="w-16 h-16 bg-sphere-card-dark rounded-full flex items-center justify-center">
              <Zap className="h-8 w-8 text-sphere-green" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Advanced Technology</h3>
            <p className="text-gray-300">
              Built on scalable blockchain architecture, our platform provides fast transaction 
              processing, minimal fees, and seamless interoperability with other blockchain 
              networks, creating a frictionless user experience.
            </p>
          </div>
        </div>
        
        <div className="flex">
          <div className="flex-shrink-0 mr-6">
            <div className="w-16 h-16 bg-sphere-card-dark rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-sphere-green" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 22C3 17.0294 7.02944 13 12 13C16.9706 13 21 17.0294 21 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Community Governance</h3>
            <p className="text-gray-300">
              Sphere Finance is governed by its community through a decentralized autonomous 
              organization (DAO). Token holders have voting rights on key decisions, ensuring 
              the platform evolves according to user needs and preferences.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeOverviewSection;
