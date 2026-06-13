'use client';
import { useState, useEffect } from 'react';
import { useWalletStore } from '@/store/walletStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function WalletConnect() {
  const { walletAddress, isConnected, connect, disconnect } = useWalletStore();
  const { isAuthenticated } = useAuthStore();
  const [connecting, setConnecting] = useState(false);
  const [peraWallet, setPeraWallet] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initPera = async () => {
      try {
        const { PeraWalletConnect } = await import('@perawallet/connect');
        const pera = new PeraWalletConnect();
        setPeraWallet(pera);
        pera.reconnectSession().then((accounts: string[]) => {
          if (accounts.length > 0) connect(accounts[0]);
        }).catch(() => {});
      } catch (err) {
        console.error('Pera init failed:', err);
      }
    };
    initPera();
  }, []);

  if (!mounted) return null;

  const handleConnect = async () => {
    if (!peraWallet) return;
    setConnecting(true);
    try {
      const accounts = await peraWallet.connect();
      if (accounts.length > 0) {
        connect(accounts[0]);
        if (isAuthenticated) {
          await api.put('/auth/connect-wallet', { walletAddress: accounts[0] });
        }
      }
    } catch (err) {
      console.error('Wallet connect failed:', err);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (peraWallet) {
      try { await peraWallet.disconnect(); } catch {}
    }
    disconnect();
  };

  const shortAddress = (addr: string) => addr.slice(0, 6) + '...' + addr.slice(-4);

  if (isConnected && walletAddress) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-[#12141A] border border-[#00D4FF]/30 px-3 py-2 rounded-lg">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-[#00D4FF] font-mono">{shortAddress(walletAddress)}</span>
        </div>
        <button
          onClick={handleDisconnect}
          className="text-xs text-[#8892A4] hover:text-red-400 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={connecting}
      className="flex items-center gap-2 border border-[#00D4FF]/30 text-[#00D4FF] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00D4FF]/10 disabled:opacity-50 transition-all"
    >
      <span>🔗</span>
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}