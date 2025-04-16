
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, ArrowRight } from "lucide-react";
import WalletConnection from "@/components/auth/WalletConnection";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const WalletConnect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleWalletConnected = () => {
    // If user is authenticated, redirect to mining dashboard
    if (user) {
      navigate("/mining");
    }
  };

  const connectManually = (wallet: string) => {
    // In a real implementation, this would connect to the specific wallet
    // For now, this just simulates the wallet selection
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      // If MetaMask is installed, trigger the connect flow
      document.querySelector<HTMLButtonElement>('button[data-wallet-connect]')?.click();
    } else {
      // Redirect to wallet installation page
      window.open(
        wallet === "MetaMask" 
          ? "https://metamask.io/download.html"
          : wallet === "Coinbase Wallet"
            ? "https://www.coinbase.com/wallet"
            : "https://wallet.wc.org",
        "_blank"
      );
    }
  };

  const wallets = [
    { name: "MetaMask", icon: "M" },
    { name: "Coinbase Wallet", icon: "C" },
    { name: "WalletConnect", icon: "W" },
    { name: "Ledger", icon: "L" },
    { name: "Trust Wallet", icon: "T" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <Card className="bg-sphere-card border-gray-800">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-3">Connect Wallet</h2>
            <p className="text-gray-400">
              Connect your wallet to access the Sphere Finance testnet mining portal.
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <WalletConnection onWalletConnected={handleWalletConnected} />
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-400 text-center mb-2">Or select a specific wallet:</p>
            {wallets.map((wallet) => (
              <Button
                key={wallet.name}
                variant="outline"
                className="w-full justify-between bg-sphere-card-dark border-gray-800 hover:bg-sphere-card hover:border-gray-700 text-white py-6"
                onClick={() => connectManually(wallet.name)}
              >
                <div className="flex items-center">
                  <div className="bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    {wallet.icon}
                  </div>
                  <span>{wallet.name}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-sm text-gray-400 text-center mb-4">
              Don't have a wallet yet?
            </p>
            <Button variant="link" className="w-full text-sphere-green">
              Learn How to Create a Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletConnect;
