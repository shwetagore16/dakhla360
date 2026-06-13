'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import {
  Shield, ArrowLeft, MapPin, User, Clock, CheckCircle,
  Star, AlertTriangle, ThumbsUp, ThumbsDown, Share2, FileText
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useWalletStore } from '@/store/walletStore';
import AssetQRCode from '@/components/assets/AssetQRCode';
import ImageUpload from '@/components/assets/ImageUpload';
import TransferAsset from '@/components/assets/TransferAsset';
import ContactOwner from '@/components/assets/ContactOwner';
import SocialShare from '@/components/assets/SocialShare';
import ExportPDF from '@/components/assets/ExportPDF';


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

const ISSUE_TYPES = ['fraud', 'dispute', 'damage', 'legal', 'stolen', 'other'];

export default function AssetDetailPage() {
  const { assetId } = useParams();
  const { isAuthenticated } = useAuthStore();
  const { walletAddress, isConnected } = useWalletStore();
  const [asset, setAsset] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '', tags: [] as string[] });
  const [issueForm, setIssueForm] = useState({ type: 'other', title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [aiSummary, setAiSummary] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [fraudAnalysis, setFraudAnalysis] = useState<any>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [assetRes, reviewRes, issueRes] = await Promise.all([
          axios.get('http://localhost:5000/api/v1/assets/' + assetId),
          axios.get('http://localhost:5000/api/v1/assets/' + assetId + '/reviews'),
          axios.get('http://localhost:5000/api/v1/assets/' + assetId + '/issues'),
        ]);
        setAsset(assetRes.data.data);
        setImages(assetRes.data.data?.images || []);
        setReviews(reviewRes.data.data);
        setIssues(issueRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (assetId) fetchAll();
  }, [assetId]);

  const submitReview = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/v1/assets/' + assetId + '/reviews',
        reviewForm,
        { headers: { Authorization: 'Bearer ' + token } }
      );
      setReviews([res.data.data, ...reviews]);
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: '', body: '', tags: [] });
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const submitIssue = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/v1/assets/' + assetId + '/issues',
        issueForm,
        { headers: { Authorization: 'Bearer ' + token } }
      );
      setIssues([res.data.data, ...issues]);
      setShowIssueForm(false);
      setIssueForm({ type: 'other', title: '', description: '' });
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Failed to submit issue');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchAiSummary = async () => {
    setAiLoading(true);
    try {
      const [summaryRes, fraudRes] = await Promise.all([
        axios.get('http://localhost:5000/api/v1/ai/summary/' + assetId),
        axios.get('http://localhost:5000/api/v1/ai/fraud/' + assetId),
      ]);
      setAiSummary(summaryRes.data.data);
      setFraudAnalysis(fraudRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Asset not found</p>
          <Link href="/explore" className="text-[#00D4FF] hover:underline">Back to Explore</Link>
        </div>
      </div>
    );
  }

  const typeColor = TYPE_COLORS[asset.type] || TYPE_COLORS.other;
  const scoreColor = asset.trustScore > 70 ? '#10B981' : asset.trustScore > 40 ? '#F59E0B' : '#EF4444';
  const scoreDash = String((asset.trustScore / 100) * 251) + ' 251';
  const currentUser = useAuthStore.getState().user;
  const isOwner = isAuthenticated && (asset.owner?.email === currentUser?.email);

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white">
      <div className="border-b border-[#1E2130] px-6 py-4 flex items-center gap-2">
        <Shield className="w-6 h-6 text-[#00D4FF]" />
        <span className="font-bold">Dakhla<span className="text-[#00D4FF]">360</span></span>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link href="/explore" className="flex items-center gap-2 text-[#8892A4] hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </Link>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={'px-3 py-1 rounded-full text-xs font-medium capitalize ' + typeColor}>
                {asset.type}
              </span>
              <span className="text-xs text-[#8892A4] font-mono bg-[#12141A] px-3 py-1 rounded-full border border-[#1E2130]">
                {asset.assetId}
              </span>
              {asset.isVerified && (
                <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              )}
              {asset.status === 'disputed' && (
                <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-3 py-1 rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  Disputed
                </span>
              )}
              {asset.algorandTxHash && (
                <span className="flex items-center gap-1 text-xs text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
                  🔗 On-Chain
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold mb-3">{asset.name}</h1>

           <div className="flex items-center gap-3 mt-3 mb-3 flex-wrap">
  <AssetQRCode assetId={asset.assetId} assetName={asset.name} />
  <SocialShare
    assetName={asset.name}
    assetId={asset.assetId}
    trustScore={asset.trustScore}
    assetType={asset.type}
  />
  <ExportPDF asset={asset} reviews={reviews} />
  {isOwner && (
    <Link
      href={'/assets/' + asset.assetId + '/edit'}
      className="flex items-center gap-2 bg-[#12141A] border border-[#1E2130] text-[#8892A4] hover:text-white hover:border-[#00D4FF]/50 px-4 py-2 rounded-lg text-sm transition-all"
    >
      <span>✏️</span>
      Edit
    </Link>
  )}
  {isOwner && (
    <TransferAsset
      assetId={asset.assetId}
      assetName={asset.name}
      onTransferComplete={() => {
        window.location.href = '/dashboard';
      }}
    />
  )}
  {!isOwner && isAuthenticated && (
    <ContactOwner
      ownerName={asset.owner?.name}
      ownerEmail={asset.owner?.email}
      assetName={asset.name}
      assetId={asset.assetId}
    />
  )}
</div>

            {asset.location?.city && (
              <div className="flex items-center gap-1 text-[#8892A4]">
                <MapPin className="w-4 h-4" />
                <span>{asset.location.city}, {asset.location.country}</span>
              </div>
            )}
          </div>

          {/* Trust Score Card */}
          <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6 text-center">
            <p className="text-[#8892A4] text-sm mb-3">Trust Score</p>
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1E2130" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke={scoreColor}
                  strokeWidth="10"
                  strokeDasharray={scoreDash}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{asset.trustScore}</span>
              </div>
            </div>
            <p className="text-xs text-[#8892A4]">out of 100</p>
            <div className="mt-4 pt-4 border-t border-[#1E2130] space-y-2">
              <div className="flex items-center gap-2 text-sm justify-center">
                <User className="w-4 h-4 text-[#8892A4]" />
                <span className="text-[#8892A4]">Owner:</span>
                <span className="font-medium">{asset.owner?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm justify-center">
                <Star className="w-4 h-4 text-[#8892A4]" />
                <span className="text-[#8892A4]">{reviews.length} reviews</span>
              </div>
              {isConnected && walletAddress && (
                <div className="flex items-center gap-2 text-xs justify-center bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 font-mono">{walletAddress.slice(0, 8)}...{walletAddress.slice(-4)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((hash: string, i: number) => (
                <div key={i} className="aspect-video rounded-xl overflow-hidden bg-[#12141A] border border-[#1E2130]">
                  <img
                    src={'https://gateway.pinata.cloud/ipfs/' + hash}
                    alt={'Property image ' + (i + 1)}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Section */}
        <div className="bg-[#12141A] border border-[#7C3AED]/30 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#7C3AED]/20 rounded-lg flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold">AI Analysis</h3>
                <p className="text-xs text-[#8892A4]">Powered by GPT-4o-mini</p>
              </div>
            </div>
            {!aiSummary && (
              <button
                onClick={fetchAiSummary}
                disabled={aiLoading}
                className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#7C3AED]/90 disabled:opacity-50 transition-all"
              >
                {aiLoading ? 'Analyzing...' : 'Get AI Summary'}
              </button>
            )}
          </div>

          {aiLoading && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-[#1E2130] rounded animate-pulse" />
              ))}
            </div>
          )}

          {aiSummary && (
            <div className="space-y-4">
              <p className="text-[#8892A4] text-sm italic">{aiSummary.summary}</p>
              {aiSummary.keyHighlights?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-green-400 mb-2">KEY HIGHLIGHTS</p>
                  <ul className="space-y-1">
                    {aiSummary.keyHighlights.map((h: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#8892A4]">
                        <span className="text-green-400 mt-0.5">✓</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {aiSummary.redFlags?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-red-400 mb-2">RED FLAGS</p>
                  <ul className="space-y-1">
                    {aiSummary.redFlags.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-400">
                        <span className="mt-0.5">⚠</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {aiSummary.buyerAdvice && (
                <div className="bg-[#00D4FF]/5 border border-[#00D4FF]/20 rounded-lg p-3">
                  <p className="text-xs font-semibold text-[#00D4FF] mb-1">BUYER ADVICE</p>
                  <p className="text-sm text-[#8892A4]">{aiSummary.buyerAdvice}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8892A4]">Confidence:</span>
                <span className={'text-xs font-semibold px-2 py-0.5 rounded-full ' +
                  (aiSummary.confidenceLevel === 'high' ? 'bg-green-500/20 text-green-400' :
                   aiSummary.confidenceLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                   'bg-red-500/20 text-red-400')}>
                  {aiSummary.confidenceLevel}
                </span>
              </div>
            </div>
          )}

          {fraudAnalysis && (
            <div className={'mt-4 pt-4 border-t border-[#1E2130] p-3 rounded-lg ' +
              (fraudAnalysis.riskLevel === 'high' ? 'bg-red-500/10 border border-red-500/20' :
               fraudAnalysis.riskLevel === 'medium' ? 'bg-yellow-500/10 border border-yellow-500/20' :
               'bg-green-500/10 border border-green-500/20')}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold">FRAUD RISK:</span>
                <span className={'text-xs font-bold uppercase ' +
                  (fraudAnalysis.riskLevel === 'high' ? 'text-red-400' :
                   fraudAnalysis.riskLevel === 'medium' ? 'text-yellow-400' :
                   'text-green-400')}>
                  {fraudAnalysis.riskLevel}
                </span>
              </div>
              <p className="text-xs text-[#8892A4]">{fraudAnalysis.recommendation}</p>
            </div>
          )}
          <p className="text-xs text-[#8892A4]/50 mt-3">AI analysis is for guidance only. Not financial advice.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#12141A] p-1 rounded-xl border border-[#1E2130] overflow-x-auto max-w-full">
          {['overview', 'history', 'reviews', 'issues', 'documents'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={'px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all whitespace-nowrap ' +
                (activeTab === tab ? 'bg-[#00D4FF] text-black' : 'text-[#8892A4] hover:text-white')}
            >
              {tab}
              {tab === 'reviews' && reviews.length > 0 && (
                <span className="ml-1 text-xs">({reviews.length})</span>
              )}
              {tab === 'issues' && issues.length > 0 && (
                <span className="ml-1 text-xs">({issues.length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-4">Description</h2>
              <p className="text-[#8892A4]">{asset.description || 'No description provided.'}</p>
            </div>

            {asset.attributes && Object.keys(asset.attributes).length > 0 && (
              <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6">
                <h2 className="font-semibold text-lg mb-4">🏠 Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {[
                    { label: 'Size', value: asset.attributes.size, icon: '📐' },
                    { label: 'Bedrooms', value: asset.attributes.bedrooms ? asset.attributes.bedrooms + ' BHK' : null, icon: '🛏️' },
                    { label: 'Bathrooms', value: asset.attributes.bathrooms, icon: '🚿' },
                    { label: 'Furnishing', value: asset.attributes.furnishing, icon: '🛋️' },
                    { label: 'Floor', value: asset.attributes.floors && asset.attributes.totalFloors ? asset.attributes.floors + ' of ' + asset.attributes.totalFloors : null, icon: '🏢' },
                    { label: 'Age', value: asset.attributes.propertyAge, icon: '📅' },
                    { label: 'Facing', value: asset.attributes.facing, icon: '🧭' },
                    { label: 'Pincode', value: asset.attributes.pincode, icon: '📍' },
                  ].filter(item => item.value).map((item) => (
                    <div key={item.label} className="bg-[#0A0B0F] rounded-xl p-4 text-center">
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <p className="text-xs text-[#8892A4] mb-1">{item.label}</p>
                      <p className="text-sm font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                {asset.attributes.expectedPrice && (
                  <div className="bg-[#0A0B0F] rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#8892A4] mb-1">Expected Price</p>
                        <p className="text-2xl font-bold text-[#00D4FF]">
                          ₹{Number(asset.attributes.expectedPrice).toLocaleString('en-IN')}
                        </p>
                        {asset.attributes.pricePerSqFt && (
                          <p className="text-xs text-[#8892A4] mt-1">
                            ₹{Number(asset.attributes.pricePerSqFt).toLocaleString('en-IN')} per sq ft
                          </p>
                        )}
                      </div>
                      {asset.attributes.isNegotiable && (
                        <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-medium">
                          Negotiable
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {asset.attributes.legalStatus && (
                  <div className={'rounded-xl p-4 mb-4 ' +
                    (asset.attributes.legalStatus === 'Clear Title' || asset.attributes.legalStatus === 'Government Approved'
                      ? 'bg-green-500/10 border border-green-500/20'
                      : 'bg-yellow-500/10 border border-yellow-500/20')}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {asset.attributes.legalStatus === 'Clear Title' || asset.attributes.legalStatus === 'Government Approved' ? '✅' : '⚠️'}
                      </span>
                      <div>
                        <p className="text-xs text-[#8892A4]">Legal Status</p>
                        <p className={'font-semibold ' +
                          (asset.attributes.legalStatus === 'Clear Title' || asset.attributes.legalStatus === 'Government Approved'
                            ? 'text-green-400' : 'text-yellow-400')}>
                          {asset.attributes.legalStatus}
                        </p>
                        {asset.attributes.registrationNumber && (
                          <p className="text-xs text-[#8892A4] mt-1">Reg No: {asset.attributes.registrationNumber}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {asset.attributes.amenities && asset.attributes.amenities.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-3">Amenities ({asset.attributes.amenities.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {asset.attributes.amenities.map((amenity: string) => (
                        <span key={amenity} className="bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] px-3 py-1 rounded-full text-xs">
                          ✓ {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {asset.attributes.landmark && (
                  <div className="mt-4 bg-[#0A0B0F] rounded-lg p-3">
                    <p className="text-xs text-[#8892A4]">📍 Landmark</p>
                    <p className="text-sm text-white mt-1">{asset.attributes.landmark}</p>
                  </div>
                )}
              </div>
            )}

            <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <span>🔗</span> Blockchain Record
              </h2>
              {asset.algorandTxHash ? (
                <div className="space-y-3">
                  <div className="bg-[#0A0B0F] rounded-lg p-4">
                    <p className="text-xs text-[#8892A4] mb-1">Algorand Transaction Hash</p>
                    <p className="text-xs text-[#00D4FF] font-mono break-all">{asset.algorandTxHash}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0A0B0F] rounded-lg p-4">
                      <p className="text-xs text-[#8892A4] mb-1">Network</p>
                      <p className="text-sm text-white">Algorand Testnet</p>
                    </div>
                    <div className="bg-[#0A0B0F] rounded-lg p-4">
                      <p className="text-xs text-[#8892A4] mb-1">Asset ID</p>
                      <p className="text-sm text-white font-mono">{asset.assetId}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.open('https://testnet.explorer.perawallet.app/tx/' + asset.algorandTxHash, '_blank')}
                    className="w-full bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-[#7C3AED] py-3 rounded-lg text-sm font-medium hover:bg-[#7C3AED]/30 transition-all flex items-center justify-center gap-2"
                  >
                    <span>🔍</span>
                    View on Algorand Explorer
                  </button>
                </div>
              ) : (
                <p className="text-[#8892A4] text-sm">Blockchain record pending...</p>
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-6">Ownership History</h2>
            <div className="space-y-4">
              {asset.ownershipHistory?.map((entry: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#00D4FF]/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-[#00D4FF]" />
                  </div>
                  <div>
                    <p className="font-medium">{entry.owner?.name || 'Unknown Owner'}</p>
                    <div className="flex items-center gap-1 text-xs text-[#8892A4] mt-1">
                      <Clock className="w-3 h-3" />
                      <span>Acquired: {new Date(entry.acquiredAt).toLocaleDateString()}</span>
                    </div>
                    {entry.txHash && (
                      <p className="text-xs text-[#00D4FF] font-mono mt-1">
                        TX: {entry.txHash.substring(0, 20)}...
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Community Reviews</h2>
              {isAuthenticated && (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-[#00D4FF] text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00D4FF]/90 transition-all"
                >
                  Write Review
                </button>
              )}
            </div>

            {showReviewForm && (
              <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6">
                <h3 className="font-semibold mb-4">Your Review</h3>
                {submitError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
                    {submitError}
                  </div>
                )}
                <div className="mb-4">
                  <label className="text-sm text-[#8892A4] mb-2 block">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })}>
                        <Star className={'w-8 h-8 ' + (star <= reviewForm.rating ? 'text-[#00D4FF] fill-[#00D4FF]' : 'text-[#1E2130]')} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-sm text-[#8892A4] mb-1 block">Title</label>
                  <input
                    type="text"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    placeholder="Summary of your experience"
                    className="w-full bg-[#0A0B0F] border border-[#1E2130] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00D4FF]"
                  />
                </div>
                <div className="mb-4">
                  <label className="text-sm text-[#8892A4] mb-1 block">Review</label>
                  <textarea
                    value={reviewForm.body}
                    onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })}
                    placeholder="Share your experience (min 10 characters)"
                    rows={4}
                    className="w-full bg-[#0A0B0F] border border-[#1E2130] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00D4FF] resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={submitReview}
                    disabled={submitting}
                    className="bg-[#00D4FF] text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#00D4FF]/90 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button onClick={() => setShowReviewForm(false)} className="bg-[#1E2130] text-white px-6 py-2 rounded-lg text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {reviews.length === 0 ? (
              <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-8 text-center">
                <p className="text-[#8892A4]">No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              reviews.map((review: any) => (
                <div key={review._id} className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#00D4FF]/20 flex items-center justify-center">
                        <span className="text-sm text-[#00D4FF]">{review.reviewer?.name?.[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{review.reviewer?.name}</p>
                        <p className="text-xs text-[#8892A4]">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={'w-4 h-4 ' + (s <= review.rating ? 'text-[#00D4FF] fill-[#00D4FF]' : 'text-[#1E2130]')} />
                      ))}
                    </div>
                  </div>
                  {review.title && <p className="font-semibold mb-2">{review.title}</p>}
                  <p className="text-[#8892A4] text-sm">{review.body}</p>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#1E2130]">
                    <button className="flex items-center gap-1 text-xs text-[#8892A4] hover:text-green-400 transition-colors">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{review.upvotes?.length || 0}</span>
                    </button>
                    <button className="flex items-center gap-1 text-xs text-[#8892A4] hover:text-red-400 transition-colors">
                      <ThumbsDown className="w-3 h-3" />
                      <span>{review.downvotes?.length || 0}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Issues Tab */}
        {activeTab === 'issues' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Issue Reports</h2>
              {isAuthenticated && (
                <button
                  onClick={() => setShowIssueForm(!showIssueForm)}
                  className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-all"
                >
                  Report Issue
                </button>
              )}
            </div>

            {showIssueForm && (
              <div className="bg-[#12141A] border border-red-500/20 rounded-xl p-6">
                <h3 className="font-semibold mb-4 text-red-400">Report an Issue</h3>
                {submitError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
                    {submitError}
                  </div>
                )}
                <div className="mb-4">
                  <label className="text-sm text-[#8892A4] mb-1 block">Issue Type</label>
                  <select
                    value={issueForm.type}
                    onChange={(e) => setIssueForm({ ...issueForm, type: e.target.value })}
                    className="w-full bg-[#0A0B0F] border border-[#1E2130] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                  >
                    {ISSUE_TYPES.map((t) => (
                      <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="text-sm text-[#8892A4] mb-1 block">Title</label>
                  <input
                    type="text"
                    value={issueForm.title}
                    onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })}
                    placeholder="Brief description of the issue"
                    className="w-full bg-[#0A0B0F] border border-[#1E2130] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                  />
                </div>
                <div className="mb-4">
                  <label className="text-sm text-[#8892A4] mb-1 block">Details</label>
                  <textarea
                    value={issueForm.description}
                    onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
                    placeholder="Provide detailed information about the issue"
                    rows={4}
                    className="w-full bg-[#0A0B0F] border border-[#1E2130] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-400 resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={submitIssue}
                    disabled={submitting}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                  <button onClick={() => setShowIssueForm(false)} className="bg-[#1E2130] text-white px-6 py-2 rounded-lg text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {issues.length === 0 ? (
              <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-8 text-center">
                <p className="text-[#8892A4]">No issues reported for this asset.</p>
              </div>
            ) : (
              issues.map((issue: any) => (
                <div key={issue._id} className="bg-[#12141A] border border-red-500/20 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-xs text-red-400 capitalize font-medium">{issue.type}</span>
                        <span className={'text-xs px-2 py-0.5 rounded-full ' +
                          (issue.status === 'open' ? 'bg-red-500/20 text-red-400' :
                           issue.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                           'bg-yellow-500/20 text-yellow-400')}>
                          {issue.status}
                        </span>
                      </div>
                      <p className="font-semibold">{issue.title}</p>
                    </div>
                  </div>
                  <p className="text-[#8892A4] text-sm">{issue.description}</p>
                  <p className="text-xs text-[#8892A4] mt-3">
                    Reported by {issue.reporter?.name} on {new Date(issue.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            {isOwner && (
              <ImageUpload
                assetId={asset.assetId}
                onUploadComplete={(hashes) => setImages(prev => [...prev, ...hashes])}
              />
            )}
            <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-4">Documents</h2>
              {(!asset.documents || asset.documents.length === 0) ? (
                <p className="text-[#8892A4]">No documents uploaded yet.</p>
              ) : (
                <div className="space-y-3">
                  {asset.documents.map((doc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-[#0A0B0F] rounded-lg p-4">
                      <span className="text-sm">{doc.name}</span>
                      <span className="text-xs text-[#00D4FF]">View on IPFS</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}