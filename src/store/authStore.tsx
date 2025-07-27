import { create } from "zustand";

interface AuthUser {
  address: string;
  picture?: string;
  balance: string;
  walletName?: string;
}

interface AuthStore {
  user: AuthUser | null;
  isConnected: boolean;
  connect: (address: string, walletName?: string) => void;
  disconnect: () => void;
  checkConnection: () => boolean;
}

// Load initial state from localStorage if available
const loadInitialState = (): { user: AuthUser | null } => {
  if (typeof window === 'undefined') return { user: null };
  
  const storedUser = localStorage.getItem('sui-wallet-user');
  return {
    user: storedUser ? JSON.parse(storedUser) : null,
  };
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: loadInitialState().user,
  isConnected: false,

  connect: (address: string, walletName?: string) => {
    const user = {
      address,
      walletName,
      picture: `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`,
      balance: '0', // Will be updated after connection
    };
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('sui-wallet-user', JSON.stringify(user));
    }
    
    set({ 
      user,
      isConnected: true 
    });
  },

  disconnect: () => {
    // Clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sui-wallet-user');
    }
    
    set({ 
      user: null, 
      isConnected: false 
    });
  },

  checkConnection: () => {
    const { user } = get();
    const isConnected = !!user?.address;
    set({ isConnected });
    return isConnected;
  },
}));
