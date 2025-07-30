"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { WalletProvider, useWallet as useSuietWallet } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
import { formatBalance, SUI_DECIMALS } from "../utils/format";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  getBalance: () => Promise<string | null>;
}

const WalletContext = createContext<WalletContextType | null>(null);

function WalletContextContent({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const wallet = useSuietWallet();

  useEffect(() => {
    if (wallet.connected) {
      setAddress(wallet.account?.address || null);
    } else {
      setAddress(null);
    }
  }, [wallet.connected, wallet.account]);

  const connect = async () => {
    try {
      setIsLoading(true);
      await wallet.select("Sui Wallet");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    try {
      wallet.disconnect();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  const getBalance = async (): Promise<string | null> => {
    if (!wallet.connected || !wallet.account?.address) {
      return null;
    }
    try {
      setIsLoading(true);
      // @ts-ignore - Sui wallet provider has getBalance method
      const balance = await wallet.getBalance({
        coinType: '0x2::sui::SUI'
      });
      return balance ? formatBalance(balance.totalBalance, SUI_DECIMALS) : null;
    } catch (error) {
      console.error("Error fetching balance:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    address,
    isConnected: wallet.connected,
    isLoading,
    connect,
    disconnect,
    getBalance,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <WalletContextContent>{children}</WalletContextContent>
    </WalletProvider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletContextProvider");
  }
  return context;
};