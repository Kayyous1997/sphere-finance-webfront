
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Check, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface WalletConnectionProps {
  onWalletConnected?: (address: string) => void;
  onWalletVerified?: () => void;
}

const WalletConnection = ({ onWalletConnected, onWalletVerified }: WalletConnectionProps) => {
  const { user, updateProfile } = useAuth();
  const [connecting, setConnecting] = useState(false);
  const [validating, setValidating] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletValidated, setWalletValidated] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // Check if the browser has Web3 provider (like MetaMask)
  const hasWeb3Provider = () => {
    return typeof window !== 'undefined' && 
           typeof window.ethereum !== 'undefined';
  };

  const connectWallet = async () => {
    if (!hasWeb3Provider()) {
      setShowDialog(true);
      return;
    }

    try {
      setConnecting(true);
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const address = accounts[0];
      setWalletAddress(address);

      // Notify parent component
      if (onWalletConnected) {
        onWalletConnected(address);
      }
      
      // If user is logged in, update their profile with the wallet address
      if (user) {
        // Check if wallet address is already linked to another user
        const { data: existingUser, error: checkError } = await supabase
          .from('profiles')
          .select('id')
          .eq('wallet_address', address)
          .neq('id', user.id)
          .maybeSingle();
        
        if (existingUser) {
          toast.error("This wallet address is already linked to another account");
          setWalletAddress(null);
          return;
        }
        
        await updateProfile({ wallet_address: address });
        toast.success("Wallet connected successfully!");
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast.error("Failed to connect wallet");
    } finally {
      setConnecting(false);
    }
  };

  const validateWallet = async () => {
    if (!walletAddress) return;
    
    try {
      setValidating(true);
      
      // Create a message to sign
      const message = `Verify wallet ownership for Sphere Finance: ${user?.id || 'signup'}`;
      
      // Request signature from the user
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, walletAddress]
      });
      
      setWalletValidated(true);
      
      // Store the signature for later verification
      if (user) {
        await supabase
          .from('profiles')
          .update({ 
            wallet_signature: signature,
            wallet_verified: true 
          })
          .eq('id', user.id);
      } else {
        // For signup flow, store in localStorage to be saved after signup
        localStorage.setItem('wallet_signature', signature);
      }
      
      // Notify parent component
      if (onWalletVerified) {
        onWalletVerified();
      }
      
      toast.success("Wallet validated successfully!");
    } catch (error) {
      console.error("Wallet validation error:", error);
      toast.error("Failed to validate wallet");
    } finally {
      setValidating(false);
    }
  };

  if (walletAddress && !walletValidated) {
    return (
      <div className="space-y-2">
        <div className="bg-sphere-card-dark border border-gray-800 p-2 rounded text-sm font-mono truncate">
          {walletAddress}
        </div>
        <Button
          onClick={validateWallet}
          disabled={validating}
          variant="outline"
          className="w-full bg-sphere-card-dark border-gray-800 hover:bg-sphere-card hover:border-gray-700 text-white"
        >
          {validating ? (
            <>Validating...</>
          ) : (
            <>
              <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
              Validate Wallet Ownership
            </>
          )}
        </Button>
      </div>
    );
  }

  if (walletAddress && walletValidated) {
    return (
      <div className="space-y-2">
        <div className="bg-sphere-card-dark border border-gray-800 p-2 rounded text-sm font-mono truncate flex items-center">
          <span className="mr-2">{walletAddress}</span>
          <Check className="h-4 w-4 text-sphere-green" />
        </div>
        <Button
          variant="outline"
          className="w-full bg-sphere-green bg-opacity-20 border-sphere-green text-sphere-green hover:bg-sphere-green hover:bg-opacity-30"
          disabled
        >
          <Check className="mr-2 h-4 w-4" />
          Wallet Validated
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={connectWallet}
        disabled={connecting}
        variant="outline"
        className="bg-sphere-card-dark border-gray-800 hover:bg-sphere-card hover:border-gray-700 text-white"
      >
        <Wallet className="mr-2 h-4 w-4" />
        {connecting ? "Connecting..." : "Connect Wallet"}
      </Button>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-sphere-card border-gray-800">
          <DialogHeader>
            <DialogTitle>Web3 Wallet Required</DialogTitle>
            <DialogDescription className="text-gray-400">
              You need a Web3 wallet like MetaMask to connect. Please install one of the following wallets:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-sphere-card-dark p-4 rounded-md">
              <h3 className="font-semibold mb-2">Popular EVM-Compatible Wallets</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>
                  <a 
                    href="https://metamask.io/download.html" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sphere-green hover:underline"
                  >
                    MetaMask
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.coinbase.com/wallet" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sphere-green hover:underline"
                  >
                    Coinbase Wallet
                  </a>
                </li>
                <li>
                  <a 
                    href="https://trustwallet.com/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sphere-green hover:underline"
                  >
                    Trust Wallet
                  </a>
                </li>
              </ul>
            </div>
            
            <p className="text-sm text-gray-400">
              After installing a wallet, refresh this page and try connecting again.
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowDialog(false)}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WalletConnection;
