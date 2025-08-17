import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction, WalletProvider } from '@mysten/dapp-kit';
import { SuiClient } from '@mysten/sui/client';
import { formatBalance, SUI_DECIMALS } from '../utils/format';

// Define storage key and expiration time (e.g., 1 hour in milliseconds)
const STORAGE_KEY = 'wallet_address';
const EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
  client: SuiClient;
  signTransaction: (input: { transaction: any }) => Promise<any>;
  executeTransaction: (input: { transaction: any }) => Promise<any>;
  getBalance: () => Promise<string | null>;
  getCoins: () => Promise<string[]>;
  reconnectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

// Interface for stored address data
interface StoredAddress {
  address: string;
  expiry: number;
}

function WalletContextContent({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransaction();

  // Initialize address from localStorage or account
  const [address, setAddress] = useState<string | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { address, expiry }: StoredAddress = JSON.parse(stored);
      if (Date.now() < expiry) {
        return address;
      } else {
        localStorage.removeItem(STORAGE_KEY); // Clear expired address
      }
    }
    return account?.address ?? null;
  });

  const isConnected = !!account;

  // Update localStorage when address changes
  useEffect(() => {
    if (account?.address) {
      const storedData: StoredAddress = {
        address: account.address,
        expiry: Date.now() + EXPIRATION_TIME,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData));
      setAddress(account.address);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setAddress(null);
    }
  }, [account?.address]);

  // Attempt to reconnect wallet if stored address exists
  const reconnectWallet = async () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { address, expiry }: StoredAddress = JSON.parse(stored);
      if (Date.now() < expiry && !account) {
        try {
          setIsLoading(true);
          // Note: @mysten/dapp-kit doesn't provide a direct reconnect API.
          // You may need to prompt the user to reconnect via the wallet provider's UI.
          // For now, we assume the wallet reconnects automatically via useCurrentAccount.
          console.log(`Attempting to reconnect wallet for address: ${address}`);
        } catch (e) {
          console.error('Error reconnecting wallet:', e);
          localStorage.removeItem(STORAGE_KEY);
          setAddress(null);
        } finally {
          setIsLoading(false);
        }
      } else if (Date.now() >= expiry) {
        localStorage.removeItem(STORAGE_KEY);
        setAddress(null);
      }
    }
  };

  // Run reconnect logic on mount
  useEffect(() => {
    reconnectWallet();
  }, []);

  const signTransaction = async ({ transaction }: { transaction: any }) => {
    return new Promise((resolve, reject) => {
      signAndExecuteTransactionBlock(
        { transaction },
        {
          onSuccess: (result) => resolve(result),
          onError: (error) => reject(error),
        }
      );
    });
  };

  const executeTransaction = async ({ transaction }: { transaction: any }) => {
    return new Promise((resolve, reject) => {
      signAndExecuteTransactionBlock(
        { transaction },
        {
          onSuccess: (result) => resolve(result),
          onError: (error) => reject(error),
        }
      );
    });
  };

  const getBalance = async (): Promise<string | null> => {
    if (!isConnected || !address) return null;
    try {
      setIsLoading(true);
      const balance = await client.getBalance({
        owner: address,
        coinType: '0x2::sui::SUI',
      });
      return balance ? formatBalance(balance.totalBalance, SUI_DECIMALS) : null;
    } catch (e) {
      console.error('Error fetching balance:', e);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getCoins = async (): Promise<string[]> => {
    if (!isConnected || !address) return [];
    try {
      const response = await client.getCoins({
        owner: address,
        coinType: '0x2::sui::SUI',
      });
      return response.data.map((coin: any) => coin.coinObjectId);
    } catch (e) {
      console.error('Error fetching coins:', e);
      return [];
    }
  };

  const value: WalletContextType = {
    address,
    isConnected,
    isLoading,
    client,
    signTransaction,
    executeTransaction,
    getBalance,
    getCoins,
    reconnectWallet,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
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
  if (!context) throw new Error('useWallet must be used within WalletContextProvider');
  return context;
};