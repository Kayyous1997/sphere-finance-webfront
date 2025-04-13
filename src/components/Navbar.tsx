
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Wallet } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "./auth/UserMenu";
import AuthModal from "./auth/AuthModal";

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
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");

  const openLoginModal = () => {
    setAuthModalTab("login");
    setIsAuthModalOpen(true);
  };

  const openSignupModal = () => {
    setAuthModalTab("signup");
    setIsAuthModalOpen(true);
  };

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
        {user ? (
          <>
            <UserMenu />
            <Link to="/mining">
              <Button variant="outline" className="hidden md:flex">
                Mining Dashboard
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Button 
              onClick={openSignupModal}
              variant="outline" 
              className="hidden md:inline-flex"
            >
              Sign Up
            </Button>
            <Button 
              onClick={openLoginModal}
              className="bg-sphere-green text-black hover:bg-green-400"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Login
            </Button>
          </>
        )}
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        defaultTab={authModalTab}
      />
    </nav>
  );
};

export default Navbar;
