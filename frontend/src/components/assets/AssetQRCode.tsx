'use client';
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface Props {
  assetId: string;
  assetName: string;
}

export default function AssetQRCode({ assetId, assetName }: Props) {
  const [qrUrl, setQrUrl] = useState('');
  const [showModal, setShowModal] = useState(false);

  const assetUrl = `http://localhost:3000/assets/${assetId}`;

  useEffect(() => {
    QRCode.toDataURL(assetUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#00D4FF',
        light: '#0A0B0F',
      },
    }).then(setQrUrl);
  }, [assetId]);

  const downloadQR = () => {
    const link = document.createElement('a');
    link.download = `dakhla360-${assetId}.png`;
    link.href = qrUrl;
    link.click();
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-[#12141A] border border-[#1E2130] text-[#8892A4] hover:text-white hover:border-[#00D4FF]/50 px-4 py-2 rounded-lg text-sm transition-all"
      >
        <span>📱</span>
        QR Code
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-[#12141A] border border-[#1E2130] rounded-2xl p-8 max-w-sm w-full">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-1">Asset QR Code</h3>
              <p className="text-[#8892A4] text-sm mb-6">
                Scan to view blockchain-verified record
              </p>

              {/* QR Code */}
              {qrUrl && (
                <div className="bg-[#0A0B0F] rounded-xl p-4 mb-4 inline-block">
                  <img src={qrUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
                </div>
              )}

              {/* Asset Info */}
              <div className="bg-[#0A0B0F] rounded-lg p-3 mb-6 text-left">
                <p className="text-xs text-[#8892A4]">Asset</p>
                <p className="text-sm font-semibold">{assetName}</p>
                <p className="text-xs text-[#00D4FF] font-mono mt-1">{assetId}</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={downloadQR}
                  className="w-full bg-[#00D4FF] text-black py-3 rounded-xl font-semibold hover:bg-[#00D4FF]/90 transition-all"
                >
                  ⬇️ Download QR Code
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(assetUrl);
                    alert('Link copied!');
                  }}
                  className="w-full border border-[#1E2130] text-white py-3 rounded-xl font-semibold hover:border-[#00D4FF]/50 transition-all"
                >
                  🔗 Copy Link
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full text-[#8892A4] py-2 text-sm hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}