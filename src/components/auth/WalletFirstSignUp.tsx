
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Check, ArrowRight, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import SignUpForm from "./SignUpForm";
import WalletConnection from "./WalletConnection";
import { supabase } from "@/integrations/supabase/client";

const WalletFirstSignUp = () => {
  const [step, setStep] = useState<'connect' | 'verify' | 'signup'>('connect');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletVerified, setWalletVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // Check if wallet is connected from local storage
    const storedWallet = localStorage.getItem('walletAddress');
    const storedVerification = localStorage.getItem('walletVerified');
    
    if (storedWallet) {
      setWalletAddress(storedWallet);
      
      // If wallet is already verified, move to signup step
      if (storedVerification === 'true') {
        setWalletVerified(true);
        setStep('signup');
      } else {
        setStep('verify');
      }
    }
  }, []);

  // When wallet is connected in the WalletConnection component
  const handleWalletConnected = (address: string) => {
    setWalletAddress(address);
    localStorage.setItem('walletAddress', address);
    setStep('verify');
  };

  // When wallet is verified in the WalletConnection component
  const handleWalletVerified = () => {
    setWalletVerified(true);
    localStorage.setItem('walletVerified', 'true');
    setStep('signup');
  };

  const checkEmailAvailability = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      setChecking(true);
      
      // Check if email is already registered
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        }
      });
      
      if (error?.message.includes("User not found")) {
        // Email is available
        setStep('signup');
      } else {
        toast.error("This email is already registered. Please use a different email or log in.");
      }
    } catch (error) {
      console.error("Error checking email:", error);
    } finally {
      setChecking(false);
    }
  };

  return (
    <Card className="bg-sphere-card border-gray-800 w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          {step === 'connect' && "Connect Your Wallet"}
          {step === 'verify' && "Verify Wallet Ownership"}
          {step === 'signup' && "Create Your Account"}
        </CardTitle>
        <CardDescription className="text-center text-gray-400">
          {step === 'connect' && "Connect your crypto wallet to get started"}
          {step === 'verify' && "Sign a message to verify ownership of your wallet"}
          {step === 'signup' && "Complete your account registration"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {step === 'connect' && (
          <div className="space-y-4">
            <div className="bg-sphere-card-dark border border-gray-800 p-4 rounded-md text-gray-300 text-sm">
              <p className="mb-2 font-medium">Why connect a wallet?</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Secure your mining rewards</li>
                <li>No gas fees on testnet</li>
                <li>Required for claiming mining rewards</li>
              </ul>
            </div>
            
            <div className="flex justify-center">
              <WalletConnection onWalletConnected={handleWalletConnected} />
            </div>
          </div>
        )}
        
        {step === 'verify' && walletAddress && (
          <div className="space-y-4">
            <div className="p-3 bg-sphere-card-dark border border-gray-800 rounded-md">
              <p className="text-sm text-gray-400 mb-1">Connected Wallet:</p>
              <div className="font-mono text-sm truncate">{walletAddress}</div>
            </div>
            
            <div className="bg-yellow-900 bg-opacity-20 border border-yellow-700 p-3 rounded-md flex items-start">
              <AlertTriangle className="text-yellow-500 mt-0.5 mr-2 flex-shrink-0" size={18} />
              <p className="text-sm text-yellow-300">
                Please sign a message to verify that you own this wallet. This doesn't cost any gas fees.
              </p>
            </div>
            
            <div className="pt-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-sphere-card-dark border-gray-800 mt-1"
              />
              <p className="text-xs text-gray-400 mt-1">
                This email will be linked to your wallet address
              </p>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button 
                onClick={checkEmailAvailability}
                disabled={checking || !email}
                className="w-full"
              >
                {checking ? "Checking..." : "Continue"}
              </Button>
            </div>
          </div>
        )}
        
        {step === 'signup' && walletAddress && walletVerified && (
          <div>
            <div className="mb-4 p-3 bg-green-900 bg-opacity-20 border border-green-700 rounded-md flex items-start">
              <Check className="text-green-500 mt-0.5 mr-2 flex-shrink-0" size={18} />
              <div>
                <p className="text-sm text-green-300 font-medium">Wallet verified!</p>
                <p className="text-xs text-green-400 mt-1">Your wallet has been verified and will be linked to your account.</p>
              </div>
            </div>
            
            <SignUpForm 
              prefilledEmail={email}
              prefilledWalletAddress={walletAddress}
              walletVerified={true}
            />
          </div>
        )}
      </CardContent>
      
      {step !== 'signup' && (
        <CardFooter className="flex justify-center border-t border-gray-800 pt-4">
          <p className="text-sm text-gray-400">
            Already have an account? <a href="/login" className="text-sphere-green hover:underline">Log in</a>
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default WalletFirstSignUp;
