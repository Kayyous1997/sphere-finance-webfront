
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// This is a simplified wallet connection component
// In a real app, you would integrate with actual blockchain wallets like MetaMask
const WalletConnection = () => {
  const { user, updateProfile } = useAuth();
  const [connecting, setConnecting] = useState(false);

  const connectWallet = async () => {
    try {
      setConnecting(true);
      
      // Simulate wallet connection 
      // In a real app, you would use a wallet provider like ethers.js or Web3
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock wallet address
      const mockWalletAddress = `0x${Math.random().toString(16).slice(2, 42)}`;
      
      // If user is logged in, update their profile with the wallet address
      if (user) {
        await updateProfile({ wallet_address: mockWalletAddress });
      }
      
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast.error("Failed to connect wallet");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <Button
      onClick={connectWallet}
      disabled={connecting}
      variant="outline"
      className="bg-sphere-card-dark border-gray-800 hover:bg-sphere-card hover:border-gray-700 text-white"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {connecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
};

export default WalletConnection;
