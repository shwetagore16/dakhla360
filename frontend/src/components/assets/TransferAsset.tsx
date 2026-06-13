'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

interface Props {
  assetId: string;
  assetName: string;
  onTransferComplete: () => void;
}

export default function TransferAsset({ assetId, assetName, onTransferComplete }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<any>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleTransfer = async () => {
    if (!confirmed) {
      setError('Please confirm the transfer');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/assets/' + assetId + '/transfer', {
        newOwnerEmail: email,
      });
      setSuccess(res.data);
      setStep(3);
      setTimeout(() => {
        onTransferComplete();
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setEmail('');
    setError('');
    setSuccess(null);
    setConfirmed(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-[#12141A] border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 px-4 py-2 rounded-lg text-sm transition-all"
      >
        <span>🔄</span>
        Transfer Ownership
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-[#12141A] border border-[#1E2130] rounded-2xl p-8 max-w-md w-full">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Transfer Ownership</h2>
              <button onClick={handleClose} className="text-[#8892A4] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {step === 1 && (
              <div>
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-orange-400 mb-1">Important Warning</p>
                      <p className="text-xs text-[#8892A4]">
                        This action is permanent and recorded on the Algorand blockchain.
                        Once transferred, you will lose ownership of this asset.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0A0B0F] rounded-xl p-4 mb-6">
                  <p className="text-xs text-[#8892A4] mb-1">Asset</p>
                  <p className="font-semibold text-white">{assetName}</p>
                  <p className="text-xs text-[#00D4FF] font-mono mt-1">{assetId}</p>
                </div>

                <div className="mb-6">
                  <label className="text-sm text-[#8892A4] mb-2 block">
                    New Owner Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="newowner@example.com"
                    className="w-full bg-[#0A0B0F] border border-[#1E2130] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
                  />
                  <p className="text-xs text-[#8892A4] mt-2">
                    The new owner must already have a Dakhla360 account
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 border border-[#1E2130] text-white py-3 rounded-xl font-semibold hover:border-[#00D4FF]/50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!email || !email.includes('@')) {
                        setError('Please enter a valid email');
                        return;
                      }
                      setError('');
                      setStep(2);
                    }}
                    className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="bg-[#0A0B0F] rounded-xl p-5 mb-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8892A4]">Asset</span>
                    <span className="text-sm font-semibold text-white">{assetName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8892A4]">Asset ID</span>
                    <span className="text-xs text-[#00D4FF] font-mono">{assetId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8892A4]">Transfer To</span>
                    <span className="text-sm font-semibold text-orange-400">{email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8892A4]">Blockchain</span>
                    <span className="text-sm text-purple-400">Algorand Testnet</span>
                  </div>
                </div>

                <div
                  onClick={() => setConfirmed(!confirmed)}
                  className={'flex items-center gap-3 p-4 rounded-xl border cursor-pointer mb-6 transition-all ' +
                    (confirmed
                      ? 'bg-orange-500/10 border-orange-500/30'
                      : 'bg-[#0A0B0F] border-[#1E2130] hover:border-orange-500/20')}
                >
                  <div className={'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ' +
                    (confirmed ? 'bg-orange-500 border-orange-500' : 'border-[#8892A4]')}>
                    {confirmed && <span className="text-white text-xs">✓</span>}
                  </div>
                  <p className="text-sm text-[#8892A4]">
                    I understand this transfer is permanent and will be recorded on the blockchain
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-[#1E2130] text-white py-3 rounded-xl font-semibold hover:border-[#00D4FF]/50 transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleTransfer}
                    disabled={loading || !confirmed}
                    className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-50 transition-all"
                  >
                    {loading ? '🔗 Recording on Blockchain...' : 'Confirm Transfer'}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && success && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Transfer Successful!</h3>
                <p className="text-[#8892A4] text-sm mb-6">
                  Ownership has been transferred to {success.data?.newOwner?.name}
                </p>

                {success.data?.txHash && (
                  <div className="bg-[#0A0B0F] rounded-xl p-4 mb-6 text-left">
                    <p className="text-xs text-[#8892A4] mb-1">Blockchain Transaction</p>
                    <p className="text-xs text-[#00D4FF] font-mono break-all">
                      {success.data.txHash}
                    </p>
                    <button
                      onClick={() => window.open('https://testnet.explorer.perawallet.app/tx/' + success.data.txHash, '_blank')}
                      className="mt-3 text-xs text-purple-400 hover:underline"
                    >
                      View on Algorand Explorer →
                    </button>
                  </div>
                )}

                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                  <p className="text-xs text-green-400">
                    ✅ Redirecting to dashboard...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}