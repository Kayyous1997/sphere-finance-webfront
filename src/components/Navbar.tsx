
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Wallet } from "lucide-react";

const NavItem = ({ 
  href, 
  children, 
  isNew = false 
}: { 
  href: string; 
  children: React.ReactNode; 
  isNew?: boolean;
}) => (
  <Link 
    to={href} 
    className="relative px-4 py-2 text-gray-300 hover:text-white transition-colors"
  >
    {children}
    {isNew && (
      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-medium bg-sphere-green text-black rounded">
        NEW
      </span>
    )}
  </Link>
);

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-sphere-dark border-b border-gray-800">
      <div className="flex items-center">
        <Link to="/" className="mr-8">
          <img 
            src="/lovable-uploads/4543ce24-37c0-4f88-ae42-12be997f85d0.png" 
            alt="Sphere Finance Logo" 
            className="h-8 w-auto"
          />
        </Link>
        <div className="hidden md:flex items-center space-x-1">
          <NavItem href="/docs">Docs</NavItem>
          <NavItem href="/testnet">
            <span className={cn(
              "px-3 py-1 rounded-md",
              "border border-sphere-green text-sphere-green"
            )}>
              Testnet
            </span>
          </NavItem>
          <NavItem href="/content" isNew={true}>Content</NavItem>
          <NavItem href="/premium" isNew={true}>Premium</NavItem>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Link to="/connect">
          <Button className="bg-sphere-green text-black hover:bg-green-400">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </Link>
        <Link to="/app">
          <Button variant="outline" className="hidden md:flex">
            Open dApp
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
