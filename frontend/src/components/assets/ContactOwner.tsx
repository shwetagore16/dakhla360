'use client';
import { useState } from 'react';
import { X, Mail, MessageSquare, Phone } from 'lucide-react';

interface Props {
  ownerName: string;
  ownerEmail: string;
  assetName: string;
  assetId: string;
}

export default function ContactOwner({ ownerName, ownerEmail, assetName, assetId }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(
    `Hi ${ownerName},\n\nI am interested in your property "${assetName}" (${assetId}) listed on Dakhla360.\n\nCould you please provide more details?\n\nThank you!`
  );
  const [copied, setCopied] = useState(false);

  const handleEmailClick = () => {
    const subject = encodeURIComponent('Inquiry about ' + assetName + ' (' + assetId + ') - Dakhla360');
    const body = encodeURIComponent(message);
    window.open('mailto:' + ownerEmail + '?subject=' + subject + '&body=' + body, '_blank');
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(message + '\n\nAsset Link: ' + window.location.href);
    window.open('https://wa.me/?text=' + text, '_blank');
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(ownerEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] hover:bg-[#00D4FF]/20 px-4 py-2 rounded-lg text-sm transition-all font-medium"
      >
        <Mail className="w-4 h-4" />
        Contact Owner
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-[#12141A] border border-[#1E2130] rounded-2xl p-8 max-w-md w-full">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Contact Owner</h2>
              <button onClick={() => setShowModal(false)} className="text-[#8892A4] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Owner Info */}
            <div className="bg-[#0A0B0F] rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#00D4FF]/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-[#00D4FF]">
                    {ownerName?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-white">{ownerName}</p>
                  <p className="text-sm text-[#8892A4]">Asset Owner</p>
                </div>
              </div>
            </div>

            {/* Asset Info */}
            <div className="bg-[#0A0B0F] rounded-xl p-4 mb-6">
              <p className="text-xs text-[#8892A4] mb-1">Regarding Asset</p>
              <p className="font-semibold text-white">{assetName}</p>
              <p className="text-xs text-[#00D4FF] font-mono mt-1">{assetId}</p>
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="text-sm text-[#8892A4] mb-2 block">Your Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full bg-[#0A0B0F] border border-[#1E2130] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00D4FF] resize-none"
              />
            </div>

            {/* Contact Options */}
            <div className="space-y-3">
              <button
                onClick={handleEmailClick}
                className="w-full flex items-center justify-center gap-3 bg-[#00D4FF] text-black py-3 rounded-xl font-semibold hover:bg-[#00D4FF]/90 transition-all"
              >
                <Mail className="w-5 h-5" />
                Send Email
              </button>

              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-3 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                Share via WhatsApp
              </button>

              <button
                onClick={copyEmail}
                className="w-full flex items-center justify-center gap-3 bg-[#12141A] border border-[#1E2130] text-[#8892A4] py-3 rounded-xl font-semibold hover:border-[#00D4FF]/50 hover:text-white transition-all"
              >
                <Phone className="w-4 h-4" />
                {copied ? '✅ Email Copied!' : 'Copy Email Address'}
              </button>
            </div>

            <p className="text-xs text-[#8892A4]/50 text-center mt-4">
              Contact information is shared only with registered Dakhla360 users
            </p>
          </div>
        </div>
      )}
    </>
  );
}