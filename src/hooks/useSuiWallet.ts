import { useCallback, useEffect } from 'react';
import { useWallets, useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { useAuthStore } from '../store/authStore';

export const useSuiWallet = () => {
  const wallets = useWallets();
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { 
    connect: connectAuth, 
    disconnect: disconnectAuth,
  } = useAuthStore();
  
  const isConnected = !!currentAccount?.address;

  // Handle wallet connection changes
  useEffect(() => {
    if (isConnected && currentAccount?.address) {
      connectAuth(currentAccount.address, currentAccount.chains?.[0]?.split(':')[0] || 'sui');
    } else if (!isConnected) {
      disconnectAuth();
    }
  }, [isConnected, currentAccount, connectAuth, disconnectAuth]);

  // Handle wallet disconnection
  const disconnect = useCallback(async () => {
    try {
      disconnectAuth();
      // The wallet will be disconnected when the user switches accounts or disconnects
      // from the wallet's UI
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }, [disconnectAuth]);

  // Get wallet connection status
  const getConnectionStatus = useCallback(() => ({
    isConnected: isConnected && !!currentAccount?.address,
    address: currentAccount?.address,
    walletName: currentAccount?.chains[0]?.split(':')[0] || 'Sui Wallet',
  }), [isConnected, currentAccount]);

  // Get wallet balance
  const getBalance = useCallback(async (address?: string) => {
    try {
      const addr = address || currentAccount?.address;
      if (!addr) return '0';
      
      const balance = await suiClient.getBalance({
        owner: addr,
        coinType: '0x2::sui::SUI',
      });
      
      return balance.totalBalance;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return '0';
    }
  }, [suiClient, currentAccount?.address]);

  return {
    connect: () => {
      // The wallet connection is handled by the wallet's UI
      // This is just a placeholder to maintain the same API
      console.log('Connect should be handled by the wallet UI');
    },
    disconnect,
    ...getConnectionStatus(),
    wallets,
    currentAccount,
    getBalance,
  };
};
