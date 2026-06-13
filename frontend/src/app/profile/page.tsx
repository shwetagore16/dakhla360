'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useWalletStore } from '@/store/walletStore';
import api from '@/lib/api';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
  Shield, Package, Star, CheckCircle,
  User, LogOut, MapPin, ArrowRight, Copy
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

function ProfileContent() {
  const { user, logout } = useAuthStore();
  const { walletAddress, isConnected } = useWalletStore();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assets');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/me');
        setProfileData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const copyWallet = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = profileData?.stats || {};
  const assets = profileData?.assets || [];
  const reviews = profileData?.reviews || [];

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white">
      {/* Navbar */}
      <nav className="border-b border-[#1E2130] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-[#00D4FF]" />
          <span className="font-bold text-lg">Dakhla<span className="text-[#00D4FF]">360</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-[#8892A4] hover:text-white text-sm transition-colors">
            Dashboard
          </Link>
          <Link href="/explore" className="text-[#8892A4] hover:text-white text-sm transition-colors">
            Explore
          </Link>
          <button onClick={logout} className="flex items-center gap-2 text-[#8892A4] hover:text-white transition-colors text-sm">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Profile Hero */}
        <div className="bg-[#12141A] border border-[#1E2130] rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#00D4FF08_0%,_transparent_60%)]" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">

            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-[#00D4FF]/20 border border-[#00D4FF]/30 flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-bold text-[#00D4FF]">
                {user?.name?.[0]?.toUpperCase()}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{user?.name}</h1>
              <p className="text-[#8892A4] text-sm mb-3">{user?.email}</p>

              <div className="flex flex-wrap gap-2">
                <span className="bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] px-3 py-1 rounded-full text-xs font-medium capitalize">
                  {user?.role}
                </span>
                {isConnected && walletAddress && (
                  <button
                    onClick={copyWallet}
                    className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium hover:bg-green-500/20 transition-all"
                  >
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    {walletAddress.slice(0, 8)}...{walletAddress.slice(-4)}
                    <Copy className="w-3 h-3 ml-1" />
                    {copied && <span className="text-green-300">Copied!</span>}
                  </button>
                )}
                {!isConnected && (
                  <span className="bg-[#1E2130] text-[#8892A4] px-3 py-1 rounded-full text-xs">
                    No wallet connected
                  </span>
                )}
              </div>
            </div>

            {/* Reputation Score */}
            <div className="text-center bg-[#0A0B0F] rounded-xl p-4 min-w-24">
              <p className="text-3xl font-bold text-[#00D4FF]">{user?.reputation?.score || 0}</p>
              <p className="text-xs text-[#8892A4] mt-1">Reputation</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Assets', value: stats.totalAssets || 0, icon: Package, color: 'text-[#00D4FF]', bg: 'bg-[#00D4FF]/10' },
            { label: 'Avg Trust Score', value: stats.avgTrustScore || 0, icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
            { label: 'Verified Assets', value: stats.verifiedAssets || 0, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
            { label: 'Reviews Given', value: reviews.length || 0, icon: User, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#12141A] border border-[#1E2130] rounded-xl p-5">
              <div className={'w-10 h-10 rounded-lg flex items-center justify-center mb-3 ' + stat.bg}>
                <stat.icon className={'w-5 h-5 ' + stat.color} />
              </div>
              <p className={'text-2xl font-bold ' + stat.color}>{stat.value}</p>
              <p className="text-xs text-[#8892A4] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#12141A] p-1 rounded-xl border border-[#1E2130] w-fit">
          {['assets', 'reviews', 'activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={'px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ' +
                (activeTab === tab ? 'bg-[#00D4FF] text-black' : 'text-[#8892A4] hover:text-white')}
            >
              {tab}
              {tab === 'assets' && assets.length > 0 && (
                <span className="ml-1 text-xs">({assets.length})</span>
              )}
              {tab === 'reviews' && reviews.length > 0 && (
                <span className="ml-1 text-xs">({reviews.length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Assets Tab */}
        {activeTab === 'assets' && (
          <div>
            {assets.length === 0 ? (
              <div className="bg-[#12141A] border border-[#1E2130] border-dashed rounded-xl p-12 text-center">
                <Package className="w-12 h-12 text-[#8892A4] mx-auto mb-4" />
                <p className="text-[#8892A4] mb-4">No assets registered yet</p>
                <Link href="/assets/create" className="bg-[#00D4FF] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00D4FF]/90 transition-all inline-block">
                  Register First Asset
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className={'w-2 h-2 rounded-full ' + (asset.trustScore > 70 ? 'bg-green-400' : asset.trustScore > 40 ? 'bg-yellow-400' : 'bg-red-400')} />
          <span className={'text-sm font-bold ' + (asset.trustScore > 70 ? 'text-green-400' : asset.trustScore > 40 ? 'text-yellow-400' : 'text-[#8892A4]')}>
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
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-12 text-center">
                <Star className="w-12 h-12 text-[#8892A4] mx-auto mb-4" />
                <p className="text-[#8892A4]">No reviews given yet</p>
              </div>
            ) : (
              reviews.map((review: any) => (
                <div key={review._id} className="bg-[#12141A] border border-[#1E2130] rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Link href={'/assets/' + review.asset?.assetId} className="font-semibold hover:text-[#00D4FF] transition-colors">
                        {review.asset?.name}
                      </Link>
                      <p className="text-xs text-[#8892A4] mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={'w-4 h-4 ' + (s <= review.rating ? 'text-[#00D4FF] fill-[#00D4FF]' : 'text-[#1E2130]')} />
                      ))}
                    </div>
                  </div>
                  {review.title && <p className="font-medium text-sm mb-1">{review.title}</p>}
                  <p className="text-[#8892A4] text-sm">{review.body}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {assets.slice(0, 5).map((asset: any) => (
                <div key={asset._id} className="flex items-center gap-4 py-3 border-b border-[#1E2130] last:border-0">
                  <div className="w-8 h-8 rounded-full bg-[#00D4FF]/20 flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-[#00D4FF]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Registered asset: {asset.name}</p>
                    <p className="text-xs text-[#8892A4]">{new Date(asset.createdAt).toLocaleDateString()}</p>
                  </div>
                  {asset.algorandTxHash && (
                    <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">
                      🔗 Blockchain
                    </span>
                  )}
                </div>
              ))}
              {reviews.slice(0, 5).map((review: any) => (
                <div key={review._id} className="flex items-center gap-4 py-3 border-b border-[#1E2130] last:border-0">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Reviewed: {review.asset?.name}</p>
                    <p className="text-xs text-[#8892A4]">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={'w-3 h-3 ' + (s <= review.rating ? 'text-[#00D4FF] fill-[#00D4FF]' : 'text-[#1E2130]')} />
                    ))}
                  </div>
                </div>
              ))}
              {assets.length === 0 && reviews.length === 0 && (
                <p className="text-[#8892A4] text-center py-8">No activity yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}