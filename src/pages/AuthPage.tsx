
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import WalletFirstSignUp from "@/components/auth/WalletFirstSignUp";
import LoginForm from "@/components/auth/LoginForm";
import AuthHero from "@/components/auth/AuthHero";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import WalletConnection from "@/components/auth/WalletConnection";

const AuthPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletVerified, setWalletVerified] = useState(false);
  
  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate("/mining");
    }
    
    // Check URL params for tab selection
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    
    if (tab === 'signup') {
      setActiveTab('signup');
    }

    // Check if wallet is already connected from local storage
    const storedWallet = localStorage.getItem('walletAddress');
    const storedVerification = localStorage.getItem('walletVerified');
    
    if (storedWallet) {
      setWalletAddress(storedWallet);
      if (storedVerification === 'true') {
        setWalletVerified(true);
      }
    }
  }, [user, navigate]);

  // When wallet is connected
  const handleWalletConnected = (address: string) => {
    setWalletAddress(address);
    localStorage.setItem('walletAddress', address);
  };

  // When wallet is verified
  const handleWalletVerified = () => {
    setWalletVerified(true);
    localStorage.setItem('walletVerified', 'true');
  };

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <div className="w-full md:w-3/5 order-2 md:order-1">
            <AuthHero />
          </div>
          
          <div className="w-full md:w-2/5 order-1 md:order-2">
            {!walletAddress ? (
              <Card className="glass-card border-gray-800">
                <CardContent className="pt-6 pb-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-3">Connect Your Wallet</h2>
                    <p className="text-gray-300 mb-6">
                      Connect your wallet to access Sphere Finance.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <WalletConnection 
                      onWalletConnected={handleWalletConnected}
                      onWalletVerified={handleWalletVerified} 
                    />
                  </div>
                </CardContent>
              </Card>
            ) : !walletVerified ? (
              <Card className="glass-card border-gray-800">
                <CardContent className="pt-6 pb-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-3">Verify Your Wallet</h2>
                    <p className="text-gray-300 mb-6">
                      Sign a message to verify ownership of your wallet.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <WalletConnection 
                      onWalletConnected={handleWalletConnected}
                      onWalletVerified={handleWalletVerified} 
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")}>
                <TabsList className="grid grid-cols-2 w-full mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Card className="glass-card border-gray-800">
                    <CardContent className="pt-6">
                      <LoginForm 
                        onSuccess={() => navigate("/mining")} 
                        prefilledWalletAddress={walletAddress}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="signup">
                  <WalletFirstSignUp 
                    walletAddress={walletAddress} 
                    walletVerified={walletVerified} 
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
