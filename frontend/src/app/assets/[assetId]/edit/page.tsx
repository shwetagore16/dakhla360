'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Shield, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const ASSET_TYPES = ['land', 'flat', 'house', 'commercial', 'car', 'bike', 'electronics', 'other'];

const AMENITIES_LIST = [
  'Parking', 'Swimming Pool', 'Gym', 'Security', 'Lift/Elevator',
  'Power Backup', 'Garden', 'Club House', 'CCTV', 'Internet',
  'Gas Pipeline', 'Water Supply 24/7', 'Maintenance Staff', 'Visitor Parking'
];

const LEGAL_STATUSES = ['Clear Title', 'Under Mortgage', 'Disputed', 'Under Litigation', 'Government Approved'];
const FURNISHING_OPTIONS = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'];

function EditAssetContent() {
  const { assetId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: '',
    type: 'house',
    description: '',
    country: '',
    city: '',
    address: '',
    pincode: '',
    landmark: '',
    size: '',
    sizeUnit: 'sq ft',
    bedrooms: '',
    bathrooms: '',
    floors: '',
    totalFloors: '',
    propertyAge: '',
    facing: '',
    furnishing: '',
    legalStatus: 'Clear Title',
    registrationNumber: '',
    previousOwners: '',
    expectedPrice: '',
    pricePerSqFt: '',
    isNegotiable: false,
  });

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await api.get('/assets/' + assetId);
        const asset = res.data.data;
        const attr = asset.attributes || {};
        setForm({
          name: asset.name || '',
          type: asset.type || 'house',
          description: asset.description || '',
          country: asset.location?.country || '',
          city: asset.location?.city || '',
          address: asset.location?.address || '',
          pincode: attr.pincode || '',
          landmark: attr.landmark || '',
          size: attr.size?.replace(/[^0-9.]/g, '') || '',
          sizeUnit: attr.size?.includes('sq mt') ? 'sq mt' : 'sq ft',
          bedrooms: attr.bedrooms || '',
          bathrooms: attr.bathrooms || '',
          floors: attr.floors || '',
          totalFloors: attr.totalFloors || '',
          propertyAge: attr.propertyAge?.replace(/[^0-9]/g, '') || '',
          facing: attr.facing || '',
          furnishing: attr.furnishing || '',
          legalStatus: attr.legalStatus || 'Clear Title',
          registrationNumber: attr.registrationNumber || '',
          previousOwners: attr.previousOwners || '',
          expectedPrice: attr.expectedPrice || '',
          pricePerSqFt: attr.pricePerSqFt || '',
          isNegotiable: attr.isNegotiable || false,
        });
        setSelectedAmenities(attr.amenities || []);
      } catch (err) {
        setError('Failed to load asset');
      } finally {
        setLoading(false);
      }
    };
    if (assetId) fetchAsset();
  }, [assetId]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.put('/assets/' + assetId, {
        name: form.name,
        type: form.type,
        description: form.description,
        location: { country: form.country, city: form.city, address: form.address },
        attributes: {
          size: form.size + ' ' + form.sizeUnit,
          bedrooms: form.bedrooms,
          bathrooms: form.bathrooms,
          floors: form.floors,
          totalFloors: form.totalFloors,
          propertyAge: form.propertyAge + ' years',
          facing: form.facing,
          furnishing: form.furnishing,
          legalStatus: form.legalStatus,
          registrationNumber: form.registrationNumber,
          previousOwners: form.previousOwners,
          expectedPrice: form.expectedPrice,
          pricePerSqFt: form.pricePerSqFt,
          isNegotiable: form.isNegotiable,
          amenities: selectedAmenities,
          landmark: form.landmark,
          pincode: form.pincode,
        },
      });
      setSuccess('Asset updated successfully!');
      setTimeout(() => router.push('/assets/' + assetId), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update asset');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-[#0A0B0F] border border-[#1E2130] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00D4FF] transition-colors";
  const labelClass = "text-sm text-[#8892A4] mb-1 block";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white">
      <div className="border-b border-[#1E2130] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-[#00D4FF]" />
          <span className="font-bold">Dakhla<span className="text-[#00D4FF]">360</span></span>
        </div>
        <Link href={'/assets/' + assetId} className="flex items-center gap-2 text-[#8892A4] hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Asset
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Edit Asset</h1>
        <p className="text-[#8892A4] mb-8">Update your asset details</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm">
            ✅ {success}
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-lg">Basic Information</h2>
            <div>
              <label className={labelClass}>Asset Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Asset Type</label>
              <div className="grid grid-cols-4 gap-2">
                {ASSET_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm({ ...form, type: t })}
                    className={'py-2 px-3 rounded-lg text-sm capitalize transition-all border ' +
                      (form.type === t ? 'bg-[#00D4FF] text-black border-[#00D4FF] font-semibold' : 'bg-[#0A0B0F] border-[#1E2130] text-[#8892A4] hover:border-[#00D4FF]/50')}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className={inputClass + ' resize-none'} />
            </div>
          </div>

          {/* Location */}
          <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-lg">Location</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Country</label>
                <input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Pincode</label>
                <input type="text" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Landmark</label>
                <input type="text" value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-lg">Property Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Size</label>
                <input type="number" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Unit</label>
                <select value={form.sizeUnit} onChange={(e) => setForm({ ...form, sizeUnit: e.target.value })} className={inputClass}>
                  <option>sq ft</option>
                  <option>sq mt</option>
                  <option>acres</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Bedrooms</label>
                <select value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} className={inputClass}>
                  <option value="">Select</option>
                  {['1', '2', '3', '4', '5', '6+'].map(n => <option key={n} value={n}>{n} BHK</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Bathrooms</label>
                <select value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} className={inputClass}>
                  <option value="">Select</option>
                  {['1', '2', '3', '4', '5+'].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Furnishing</label>
              <div className="grid grid-cols-3 gap-2">
                {FURNISHING_OPTIONS.map(f => (
                  <button
                    key={f}
                    onClick={() => setForm({ ...form, furnishing: f })}
                    className={'py-2 px-3 rounded-lg text-sm transition-all border ' +
                      (form.furnishing === f ? 'bg-[#00D4FF] text-black border-[#00D4FF] font-semibold' : 'bg-[#0A0B0F] border-[#1E2130] text-[#8892A4] hover:border-[#00D4FF]/50')}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_LIST.map(amenity => (
                <button
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={'px-3 py-2 rounded-lg text-sm transition-all border ' +
                    (selectedAmenities.includes(amenity)
                      ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-[#00D4FF]'
                      : 'bg-[#0A0B0F] border-[#1E2130] text-[#8892A4] hover:border-[#00D4FF]/50')}
                >
                  {selectedAmenities.includes(amenity) ? '✓ ' : ''}{amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Legal & Pricing */}
          <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-lg">Legal & Pricing</h2>
            <div>
              <label className={labelClass}>Legal Status</label>
              <div className="grid grid-cols-2 gap-2">
                {LEGAL_STATUSES.map(status => (
                  <button
                    key={status}
                    onClick={() => setForm({ ...form, legalStatus: status })}
                    className={'py-2 px-3 rounded-lg text-sm transition-all border text-left ' +
                      (form.legalStatus === status
                        ? status === 'Clear Title' || status === 'Government Approved'
                          ? 'bg-green-500/20 border-green-500 text-green-400 font-semibold'
                          : 'bg-red-500/20 border-red-500 text-red-400 font-semibold'
                        : 'bg-[#0A0B0F] border-[#1E2130] text-[#8892A4] hover:border-[#00D4FF]/50')}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Registration Number</label>
              <input type="text" value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Expected Price (₹)</label>
                <input type="number" value={form.expectedPrice} onChange={(e) => setForm({ ...form, expectedPrice: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Price per sq ft (₹)</label>
                <input type="number" value={form.pricePerSqFt} onChange={(e) => setForm({ ...form, pricePerSqFt: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setForm({ ...form, isNegotiable: !form.isNegotiable })}
                className={'w-12 h-6 rounded-full transition-all ' + (form.isNegotiable ? 'bg-[#00D4FF]' : 'bg-[#1E2130]')}
              >
                <div className={'w-5 h-5 bg-white rounded-full transition-all mx-0.5 ' + (form.isNegotiable ? 'translate-x-6' : 'translate-x-0')} />
              </button>
              <label className="text-sm text-[#8892A4]">Price is Negotiable</label>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#00D4FF] text-black py-4 rounded-xl font-semibold hover:bg-[#00D4FF]/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-lg"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditAssetPage() {
  return (
    <ProtectedRoute>
      <EditAssetContent />
    </ProtectedRoute>
  );
}