import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
  walletAddress: string | null;
  isConnected: boolean;
  connect: (address: string) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      walletAddress: null,
      isConnected: false,
      connect: (address: string) => set({ walletAddress: address, isConnected: true }),
      disconnect: () => set({ walletAddress: null, isConnected: false }),
    }),
    { name: 'wallet-storage' }
  )
);