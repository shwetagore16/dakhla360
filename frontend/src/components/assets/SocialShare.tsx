'use client';
import { useState } from 'react';
import { X, Share2 } from 'lucide-react';

interface Props {
  assetName: string;
  assetId: string;
  trustScore: number;
  assetType: string;
}

export default function SocialShare({ assetName, assetId, trustScore, assetType }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const assetUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out "${assetName}" on Dakhla360 - Blockchain verified ${assetType} with Trust Score ${trustScore}/100! 🔗`;

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: '💬',
      color: 'bg-green-500 hover:bg-green-600',
      action: () => window.open('https://wa.me/?text=' + encodeURIComponent(shareText + '\n' + assetUrl), '_blank'),
    },
    {
      name: 'Twitter / X',
      icon: '🐦',
      color: 'bg-black hover:bg-gray-900 border border-[#1E2130]',
      action: () => window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText) + '&url=' + encodeURIComponent(assetUrl), '_blank'),
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(assetUrl), '_blank'),
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: 'bg-sky-500 hover:bg-sky-600',
      action: () => window.open('https://t.me/share/url?url=' + encodeURIComponent(assetUrl) + '&text=' + encodeURIComponent(shareText), '_blank'),
    },
    {
      name: 'Facebook',
      icon: '📘',
      color: 'bg-blue-700 hover:bg-blue-800',
      action: () => window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(assetUrl), '_blank'),
    },
    {
      name: 'Email',
      icon: '📧',
      color: 'bg-[#7C3AED] hover:bg-[#7C3AED]/90',
      action: () => {
        const subject = encodeURIComponent('Check this verified asset on Dakhla360');
        const body = encodeURIComponent(shareText + '\n\n' + assetUrl);
        window.open('mailto:?subject=' + subject + '&body=' + body, '_blank');
      },
    },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(assetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-[#12141A] border border-[#1E2130] text-[#8892A4] hover:text-white hover:border-[#00D4FF]/50 px-4 py-2 rounded-lg text-sm transition-all"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-[#12141A] border border-[#1E2130] rounded-2xl p-8 max-w-md w-full">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Share Asset</h2>
              <button onClick={() => setShowModal(false)} className="text-[#8892A4] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Asset Preview */}
            <div className="bg-[#0A0B0F] rounded-xl p-4 mb-6 border border-[#1E2130]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#00D4FF]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🏠</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{assetName}</p>
                  <p className="text-xs text-[#8892A4] mt-1">{assetId} • Trust Score: {trustScore}/100</p>
                  <p className="text-xs text-[#00D4FF] mt-1 truncate">{assetUrl}</p>
                </div>
              </div>
            </div>

            {/* Share Message Preview */}
            <div className="bg-[#0A0B0F] rounded-xl p-4 mb-6 border border-[#1E2130]">
              <p className="text-xs text-[#8892A4] mb-2">Share Message</p>
              <p className="text-sm text-white">{shareText}</p>
            </div>

            {/* Share Options */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => {
                    option.action();
                    setShowModal(false);
                  }}
                  className={'flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-xl text-white font-medium text-sm transition-all ' + option.color}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-xs">{option.name}</span>
                </button>
              ))}
            </div>

            {/* Copy Link */}
            <div className="flex gap-2">
              <div className="flex-1 bg-[#0A0B0F] border border-[#1E2130] rounded-lg px-4 py-3 text-xs text-[#8892A4] truncate">
                {assetUrl}
              </div>
              <button
                onClick={copyLink}
                className={'px-4 py-3 rounded-lg text-sm font-medium transition-all ' +
                  (copied ? 'bg-green-500 text-white' : 'bg-[#00D4FF] text-black hover:bg-[#00D4FF]/90')}
              >
                {copied ? '✅ Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}