'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import WalletConnect from '@/components/wallet/WalletConnect';
import {
  Shield, LogOut, Plus, Package,
  Star, CheckCircle, ArrowRight,
  MapPin, User
} from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
  land: 'bg-green-500/20 text-green-400',
  flat: 'bg-blue-500/20 text-blue-400',
  house: 'bg-purple-500/20 text-purple-400',
  commercial: 'bg-orange-500/20 text-orange-400',
  car: 'bg-red-500/20 text-red-400',
  bike: 'bg-yellow-500/20 text-yellow-400',
  electronics: 'bg-cyan-500/20 text-cyan-400',
  other: 'bg-gray-500/20 text-gray-400',
};

function DashboardContent() {
  const { user, logout } = useAuthStore();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await api.get('/assets/my-assets');
        setAssets(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const avgTrust = assets.length > 0
    ? Math.round(assets.reduce((s, a) => s + a.trustScore, 0) / assets.length)
    : 0;
  const onChainAssets = assets.filter((a: any) => a.algorandTxHash).length;

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white">
      {/* Top Nav */}
      <nav className="border-b border-[#1E2130] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-[#00D4FF]" />
          <span className="font-bold text-lg">Dakhla<span className="text-[#00D4FF]">360</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/explore" className="text-[#8892A4] hover:text-white text-sm transition-colors">
            Explore
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-2 text-[#8892A4] hover:text-white text-sm transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#00D4FF]/20 border border-[#00D4FF]/30 flex items-center justify-center">
              <span className="text-xs font-bold text-[#00D4FF]">{user?.name?.[0]}</span>
            </div>
            <span className="hidden md:block">{user?.name}</span>
          </Link>
          <WalletConnect />
          <Link
            href="/assets/create"
            className="bg-[#00D4FF] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#00D4FF]/90 transition-all flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:block">New Asset</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-[#8892A4] hover:text-white transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Welcome */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-[#8892A4]">
              Here's your asset portfolio overview
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-[#12141A] border border-[#1E2130] rounded-xl px-4 py-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-[#8892A4]">All systems operational</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            {
              label: 'My Assets',
              value: assets.length,
              icon: Package,
              color: 'text-[#00D4FF]',
              bg: 'bg-[#00D4FF]/10',
              border: 'border-[#00D4FF]/20',
              sub: onChainAssets + ' on blockchain',
            },
            {
              label: 'Avg Trust Score',
              value: avgTrust + '/100',
              icon: Star,
              color: 'text-yellow-400',
              bg: 'bg-yellow-500/10',
              border: 'border-yellow-500/20',
              sub: avgTrust > 50 ? 'Good standing' : 'Add reviews to improve',
            },
            {
              label: 'Verified Assets',
              value: assets.filter((a: any) => a.isVerified).length,
              icon: CheckCircle,
              color: 'text-green-400',
              bg: 'bg-green-500/10',
              border: 'border-green-500/20',
              sub: 'Community verified',
            },
            {
              label: 'Reputation',
              value: user?.reputation?.score || 0,
              icon: User,
              color: 'text-purple-400',
              bg: 'bg-purple-500/10',
              border: 'border-purple-500/20',
              sub: 'Trust points earned',
            },
          ].map((stat) => (
            <div key={stat.label} className={'bg-[#12141A] border rounded-xl p-5 ' + stat.border}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[#8892A4] text-sm">{stat.label}</p>
                <div className={'w-9 h-9 rounded-lg flex items-center justify-center ' + stat.bg}>
                  <stat.icon className={'w-4 h-4 ' + stat.color} />
                </div>
              </div>
              <p className={'text-3xl font-bold mb-1 ' + stat.color}>{stat.value}</p>
              <p className="text-xs text-[#8892A4]">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* My Assets Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">My Assets</h2>
          <Link
            href="/assets/create"
            className="flex items-center gap-1 text-[#00D4FF] hover:underline text-sm"
          >
            <Plus className="w-4 h-4" />
            Register New
          </Link>
        </div>

        {/* Assets Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#12141A] border border-[#1E2130] rounded-xl h-48 animate-pulse" />
            ))}
          </div>
        ) : assets.length === 0 ? (
          <div className="bg-[#12141A] border border-[#1E2130] border-dashed rounded-xl p-12 text-center">
            <Package className="w-12 h-12 text-[#8892A4] mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No assets yet</h3>
            <p className="text-[#8892A4] text-sm mb-6">Register your first asset on the blockchain</p>
            <Link
              href="/assets/create"
              className="bg-[#00D4FF] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00D4FF]/90 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Register Asset
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset: any) => (
              <Link key={asset._id} href={'/assets/' + asset.assetId}>
                <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6 hover:border-[#00D4FF]/40 hover:shadow-lg hover:shadow-[#00D4FF]/5 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-4">
                    <span className={'px-2 py-1 rounded-full text-xs font-medium capitalize ' + (TYPE_COLORS[asset.type] || TYPE_COLORS.other)}>
                      {asset.type}
                    </span>
                    <div className="flex items-center gap-2">
                      {asset.algorandTxHash && (
                        <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                          🔗 On-Chain
                        </span>
                      )}
                      <span className="text-xs text-[#8892A4] font-mono">{asset.assetId}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-[#00D4FF] transition-colors">
                    {asset.name}
                  </h3>
                  {asset.location?.city && (
                    <div className="flex items-center gap-1 text-xs text-[#8892A4] mb-4">
                      <MapPin className="w-3 h-3" />
                      {asset.location.city}, {asset.location.country}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-[#1E2130]">
                    <div className="flex items-center gap-1">
                      <div className={'w-2 h-2 rounded-full ' +
                        (asset.trustScore > 70 ? 'bg-green-400' :
                         asset.trustScore > 40 ? 'bg-yellow-400' : 'bg-red-400')} />
                      <span className={'text-sm font-bold ' +
                        (asset.trustScore > 70 ? 'text-green-400' :
                         asset.trustScore > 40 ? 'text-yellow-400' : 'text-[#8892A4]')}>
                        {asset.trustScore}
                      </span>
                      <span className="text-xs text-[#8892A4]">trust</span>
                    </div>
                    <span className={'text-xs px-2 py-0.5 rounded-full ' +
                      (asset.status === 'active' ? 'bg-green-500/10 text-green-400' :
                       asset.status === 'disputed' ? 'bg-red-500/10 text-red-400' :
                       'bg-[#1E2130] text-[#8892A4]')}>
                      {asset.status}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#8892A4] group-hover:text-[#00D4FF] transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}