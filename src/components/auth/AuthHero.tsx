
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AuthModal from "./AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import WalletConnection from "./WalletConnection";

const AuthHero = () => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("signup");

  const openLoginModal = () => {
    setAuthModalTab("login");
    setIsAuthModalOpen(true);
  };

  const openSignupModal = () => {
    setAuthModalTab("signup");
    setIsAuthModalOpen(true);
  };

  if (user) {
    return (
      <div className="bg-gradient-to-r from-sphere-dark to-sphere-darker p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome back!</h2>
        <p className="text-gray-300 mb-6">You're signed in as {user.email}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <a href="/mining">Go to Mining Dashboard</a>
          </Button>
          <WalletConnection />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-sphere-dark to-sphere-darker p-8 rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4">Join Sphere Finance Today</h2>
      <p className="text-gray-300 mb-6">Create an account to start mining or connect your wallet to access the platform.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={openSignupModal}
          className="bg-sphere-green text-black hover:bg-green-400"
        >
          Create Account
        </Button>
        <Button 
          onClick={openLoginModal}
          variant="outline"
        >
          Login
        </Button>
        <WalletConnection />
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        defaultTab={authModalTab}
      />
    </div>
  );
};

export default AuthHero;
