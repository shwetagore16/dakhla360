'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield, Star, FileCheck, Users,
  AlertTriangle, ArrowRight, Zap, Lock, X
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import WalletConnect from '@/components/wallet/WalletConnect';

const FEATURES = [
  { icon: Shield, title: 'Digital Asset Passport', desc: 'Every asset gets a unique blockchain ID with complete history.' },
  { icon: FileCheck, title: 'Blockchain Verified', desc: 'All records stored immutably on Algorand blockchain.' },
  { icon: Star, title: 'AI Trust Score', desc: 'AI-powered scoring system rates every asset 0-100.' },
  { icon: Users, title: 'Community Reviews', desc: 'Real users share verified experiences and insights.' },
  { icon: Lock, title: 'IPFS Document Storage', desc: 'Documents stored permanently on decentralized storage.' },
  { icon: AlertTriangle, title: 'Fraud Detection', desc: 'AI detects suspicious patterns and flags risky assets.' },
];

const ASSET_TYPES = [
  { emoji: '🏠', label: 'House' },
  { emoji: '🏢', label: 'Commercial' },
  { emoji: '🌍', label: 'Land' },
  { emoji: '🏙️', label: 'Flat' },
  { emoji: '🚗', label: 'Car' },
  { emoji: '🏍️', label: 'Bike' },
  { emoji: '💻', label: 'Electronics' },
  { emoji: '📦', label: 'Other' },
];

const STEPS = [
  { step: '01', title: 'Register Asset', desc: 'Add your asset with details and documents. Get a unique blockchain ID instantly.' },
  { step: '02', title: 'Community Verifies', desc: 'Real users review and verify the asset. Build trust through community.' },
  { step: '03', title: 'Get Trust Score', desc: 'AI calculates a 0-100 trust score based on all data points.' },
];

function LoginPromptModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-[#12141A] border border-[#1E2130] rounded-2xl p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#8892A4] hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#00D4FF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-[#00D4FF]" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className="text-[#8892A4] text-sm">
            You need to sign in to access this feature. Join Dakhla360 to register assets, write reviews, and more!
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-[#00D4FF] text-black py-3 rounded-xl font-semibold hover:bg-[#00D4FF]/90 transition-all"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push('/register')}
            className="w-full border border-[#1E2130] text-white py-3 rounded-xl font-semibold hover:border-[#00D4FF]/50 transition-all"
          >
            Create Account
          </button>
          <button onClick={onClose} className="w-full text-[#8892A4] py-2 text-sm hover:text-white transition-colors">
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleProtectedClick = (path: string) => {
    if (isAuthenticated) {
      router.push(path);
    } else {
      setShowLoginPrompt(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white">
      {showLoginPrompt && <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />}

      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-[#1E2130]/50 bg-[#0A0B0F]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-[#00D4FF]" />
            <span className="text-xl font-bold">Dakhla<span className="text-[#00D4FF]">360</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/explore" className="text-[#8892A4] hover:text-white transition-colors text-sm">Explore</Link>
            <Link href="#features" className="text-[#8892A4] hover:text-white transition-colors text-sm">Features</Link>
            <Link href="#how" className="text-[#8892A4] hover:text-white transition-colors text-sm">How it Works</Link>
          </div>
          <div className="flex items-center gap-3">
            <WalletConnect />
            {isAuthenticated ? (
              <button
                onClick={() => handleProtectedClick('/dashboard')}
                className="bg-[#00D4FF] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#00D4FF]/90 transition-all"
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link href="/login" className="text-[#8892A4] hover:text-white transition-colors text-sm">Sign In</Link>
                <Link href="/register" className="bg-[#00D4FF] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#00D4FF]/90 transition-all">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#00D4FF10_0%,_transparent_60%)]" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl" />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <div className="inline-flex items-center gap-2 bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#7C3AED] px-4 py-2 rounded-full text-sm">
              <span>⛓️</span>
              Built on Algorand Blockchain
            </div>
            <div className="inline-flex items-center gap-2 bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] px-4 py-2 rounded-full text-sm">
              <Zap className="w-4 h-4" />
              AI Powered Trust Scores
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Know Everything
            <br />
            <span className="text-[#00D4FF]">Before You Buy</span>
          </h1>
          <p className="text-xl text-[#8892A4] mb-10 max-w-2xl mx-auto leading-relaxed">
            Blockchain-verified asset history, AI trust scores, and community insights for informed purchasing decisions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/explore" className="bg-[#00D4FF] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#00D4FF]/90 transition-all flex items-center justify-center gap-2">
              Explore Assets
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={() => handleProtectedClick('/assets/create')}
              className="border border-[#1E2130] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:border-[#00D4FF]/50 transition-all"
            >
              Register Asset
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: '100%', label: 'Blockchain Verified' },
              { value: 'Algorand', label: 'Powered By' },
              { value: '360°', label: 'Asset View' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-[#00D4FF]">{stat.value}</p>
                <p className="text-xs text-[#8892A4] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 border-y border-[#1E2130]">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[#8892A4] text-sm mb-8">Verify any valuable asset</p>
          <div className="flex flex-wrap justify-center gap-4">
            {ASSET_TYPES.map((type) => (
              <div key={type.label} className="flex items-center gap-2 bg-[#12141A] border border-[#1E2130] px-5 py-3 rounded-xl hover:border-[#00D4FF]/30 transition-all cursor-pointer">
                <span className="text-2xl">{type.emoji}</span>
                <span className="text-sm font-medium">{type.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How Dakhla360 Works</h2>
            <p className="text-[#8892A4]">Three simple steps to complete asset transparency</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-[#12141A] border border-[#1E2130] rounded-2xl p-8 hover:border-[#00D4FF]/30 transition-all">
                  <div className="text-5xl font-bold text-[#00D4FF]/20 mb-4">{step.step}</div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-[#8892A4] text-sm leading-relaxed">{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 z-10">
                    <ArrowRight className="w-8 h-8 text-[#1E2130]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 bg-[#080909]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-[#8892A4]">Complete toolkit for informed asset decisions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <div key={i} className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6 hover:border-[#00D4FF]/30 transition-all group">
                <div className="w-12 h-12 bg-[#00D4FF]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#00D4FF]/20 transition-all">
                  <feature.icon className="w-6 h-6 text-[#00D4FF]" />
                </div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-[#8892A4] text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#12141A] border border-[#7C3AED]/20 rounded-3xl p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#7C3AED08_0%,_transparent_70%)]" />
            <div className="relative">
              <div className="text-5xl mb-4">⛓️</div>
              <h2 className="text-3xl font-bold mb-4">Powered by Algorand</h2>
              <p className="text-[#8892A4] mb-8 max-w-xl mx-auto">
                Every asset registration is permanently recorded on the Algorand blockchain. Fast, cheap, and carbon-neutral transactions.
              </p>
              <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
                {[
                  { value: '4s', label: 'Finality' },
                  { value: '$0.001', label: 'Tx Cost' },
                  { value: '100%', label: 'Carbon Neutral' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#0A0B0F] rounded-xl p-4">
                    <p className="text-2xl font-bold text-[#7C3AED]">{stat.value}</p>
                    <p className="text-xs text-[#8892A4] mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#080909]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-[#12141A] border border-[#1E2130] rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#00D4FF08_0%,_transparent_70%)]" />
            <div className="relative">
              <h2 className="text-4xl font-bold mb-4">Start Verifying Today</h2>
              <p className="text-[#8892A4] mb-8">Join the blockchain-powered asset verification network</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleProtectedClick('/dashboard')}
                  className="bg-[#00D4FF] text-black px-8 py-4 rounded-xl font-semibold hover:bg-[#00D4FF]/90 transition-all"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Create Free Account'}
                </button>
                <Link href="/explore" className="border border-[#1E2130] text-white px-8 py-4 rounded-xl font-semibold hover:border-[#00D4FF]/50 transition-all">
                  Browse Assets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#1E2130] py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00D4FF]" />
            <span className="font-bold">Dakhla<span className="text-[#00D4FF]">360</span></span>
          </div>
          <p className="text-[#8892A4] text-sm">Built on Algorand Blockchain. Powered by AI.</p>
          <div className="flex gap-6">
            <Link href="/explore" className="text-[#8892A4] hover:text-white text-sm transition-colors">Explore</Link>
            <Link href="/register" className="text-[#8892A4] hover:text-white text-sm transition-colors">Register</Link>
            <Link href="/login" className="text-[#8892A4] hover:text-white text-sm transition-colors">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}