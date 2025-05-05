
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowRight, Loader2 } from "lucide-react";
import SignUpForm from "@/components/auth/SignUpForm";

const WalletFirstSignUp = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("referralCode");
  const { user, connectWallet } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    if (user) {
      setIsLoggedIn(true);
      navigate("/mining");
    }
  }, [user, navigate]);

  const handleConnectWallet = async () => {
    setIsLoading(true);
    try {
      const address = await connectWallet();
      if (address) {
        setWalletAddress(address);
        toast({
          title: "Wallet Connected",
          description: "Your wallet is now connected.",
        });
      }
    } catch (error: any) {
      console.error("Metamask connect error:", error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: error.message || "Failed to connect to Metamask.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSuccess = () => {
    setIsLoggedIn(true);
    navigate("/mining");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md bg-sphere-card">
        <CardHeader className="flex flex-col items-center justify-center space-y-2 font-bold">
          <CardTitle className="text-2xl">
            {isLoggedIn ? "Welcome Back!" : "Get Started"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {!isLoggedIn && !walletAddress ? (
            <div className="flex flex-col space-y-4">
              <Button
                className="bg-yellow-500 hover:bg-yellow-400 text-black"
                onClick={handleConnectWallet}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Metamask
                  </>
                )}
              </Button>
              <p className="text-sm text-center text-gray-500">
                Connect your Metamask wallet to sign up or log in.
              </p>
            </div>
          ) : null}

          {walletAddress && !isLoggedIn ? (
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="wallet">Wallet Address</Label>
                <Input
                  id="wallet"
                  value={walletAddress}
                  readOnly
                  className="cursor-not-allowed"
                />
              </div>

              <SignUpForm
                onSuccess={handleSignUpSuccess}
                referralCode={referralCode}
              />
            </div>
          ) : null}

          {isLoggedIn ? (
            <div className="flex flex-col items-center space-y-4">
              <p className="text-lg">You are already logged in!</p>
              <Button onClick={() => navigate("/mining")}>
                Go to Mining Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletFirstSignUp;
