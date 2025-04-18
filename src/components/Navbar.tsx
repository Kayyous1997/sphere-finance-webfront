import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Wallet, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "./auth/UserMenu";
import AuthModal from "./auth/AuthModal";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

const NavItem = ({ 
  href, 
  children,
  onClick
}: { 
  href: string; 
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <Link 
    to={href} 
    className="relative px-4 py-2 text-gray-300 hover:text-white transition-colors"
    onClick={onClick}
  >
    {children}
  </Link>
);

const Navbar = () => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openLoginModal = () => {
    setAuthModalTab("login");
    setIsAuthModalOpen(true);
  };

  const openSignupModal = () => {
    setAuthModalTab("signup");
    setIsAuthModalOpen(true);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
        </div>
      </div>
      
      {/* Desktop menu */}
      <div className="hidden md:flex items-center space-x-2">
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
      
      {/* Mobile menu button */}
      <div className="flex md:hidden items-center">
        {user && <UserMenu />}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-2">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-sphere-dark border-gray-800 p-0">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-gray-800">
                <Link to="/" onClick={closeMobileMenu}>
                  <img 
                    src="/lovable-uploads/4543ce24-37c0-4f88-ae42-12be997f85d0.png" 
                    alt="Sphere Finance Logo" 
                    className="h-8 w-auto"
                  />
                </Link>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-6 w-6" />
                  </Button>
                </SheetClose>
              </div>
              
              <div className="flex flex-col p-4 space-y-4">
                <NavItem href="/docs" onClick={closeMobileMenu}>Docs</NavItem>
                <NavItem href="/testnet" onClick={closeMobileMenu}>
                  <span className={cn(
                    "px-3 py-1 rounded-md",
                    "border border-sphere-green text-sphere-green"
                  )}>
                    Testnet
                  </span>
                </NavItem>
                
                {user ? (
                  <Link to="/mining" onClick={closeMobileMenu}>
                    <Button variant="outline" className="w-full">
                      Mining Dashboard
                    </Button>
                  </Link>
                ) : (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-gray-800">
                    <Button 
                      onClick={() => {
                        openSignupModal();
                        closeMobileMenu();
                      }}
                      variant="outline" 
                      className="w-full"
                    >
                      Sign Up
                    </Button>
                    <Button 
                      onClick={() => {
                        openLoginModal();
                        closeMobileMenu();
                      }}
                      className="w-full bg-sphere-green text-black hover:bg-green-400"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
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
