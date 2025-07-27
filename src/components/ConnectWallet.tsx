import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { useSuiWallet } from "../hooks/useSuiWallet";

export const ConnectWallet: React.FC = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const { disconnect, isConnected, address, walletName, wallets } = useSuiWallet();
  
  const handleConnectWallet = useCallback(async (walletName: string) => {
    try {
      setIsConnecting(true);
      // In dApp Kit, the wallet connection is handled by the wallet's UI
      // We'll just navigate to the profile page if we're already connected
      if (isConnected) {
        navigate("/profile");
      } else {
        // The actual connection will be handled by the wallet's UI
        console.log(`Initiating connection to ${walletName}`);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnected, navigate]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  }, [disconnect]);

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-background-primary p-4 lg:p-6 flex items-center justify-center">
        <Card variant="outlined" className="max-w-md w-full p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-text-primary">Connecting to wallet...</h3>
          <p className="text-text-secondary mt-2">Please approve the connection in your wallet</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary p-4 lg:p-6 flex items-center justify-center">
      <Card variant="outlined" className="max-w-md w-full">
        <div className="flex flex-col items-center text-center p-6">
          <div className="w-16 h-16 rounded-full bg-surface-secondary flex items-center justify-center mb-4">
            <Wallet size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">
            {isConnected ? "Wallet Connected" : "Connect Your Wallet"}
          </h2>
          <p className="text-body2 text-text-secondary mb-6 max-w-xs">
            {isConnected 
              ? "Your wallet is connected and ready to use."
              : "Connect your wallet to access your bookings, manage your profile, and make secure transactions."
            }
          </p>
          
          {!isConnected ? (
            <div className="w-full space-y-3">
              {wallets.map((wallet) => (
                <Button
                  key={wallet.name}
                  onClick={() => handleConnectWallet(wallet.name)}
                  className="w-full bg-primary text-text-inverse rounded-md py-3 flex items-center justify-center gap-2"
                >
                  {wallet.icon && (
                    <img 
                      src={wallet.icon} 
                      alt={wallet.name}
                      className="w-5 h-5"
                    />
                  )}
                  Connect with {wallet.name}
                </Button>
              ))}
            </div>
          ) : (
            <div className="w-full space-y-4">
              <div className="p-4 bg-surface-secondary rounded-md text-left">
                <p className="text-sm font-medium text-text-secondary mb-1">Connected Wallet</p>
                <p className="font-mono text-sm break-all text-text-primary">
                  {address}
                </p>
                {walletName && (
                  <p className="text-xs text-text-tertiary mt-1">
                    Connected with {walletName}
                  </p>
                )}
              </div>
              <Button
                onClick={handleDisconnect}
                variant="outline"
                className="w-full py-3"
              >
                Disconnect Wallet
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ConnectWallet;
