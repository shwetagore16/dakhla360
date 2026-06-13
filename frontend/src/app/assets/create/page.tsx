'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Shield, ArrowLeft, Plus, X } from 'lucide-react';
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

const FACING_OPTIONS = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];

function CreateAssetContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [form, setForm] = useState({
    // Basic
    name: '',
    type: 'house',
    description: '',
    // Location
    country: 'India',
    city: '',
    address: '',
    pincode: '',
    landmark: '',
    // Property Details
    size: '',
    sizeUnit: 'sq ft',
    bedrooms: '',
    bathrooms: '',
    floors: '',
    totalFloors: '',
    propertyAge: '',
    facing: '',
    furnishing: '',
    // Legal
    legalStatus: 'Clear Title',
    registrationNumber: '',
    previousOwners: '',
    // Pricing
    expectedPrice: '',
    pricePerSqFt: '',
    isNegotiable: false,
  });

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const attributes: any = {
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
      };

      const res = await api.post('/assets', {
        name: form.name,
        type: form.type,
        description: form.description,
        location: {
          country: form.country,
          city: form.city,
          address: form.address,
        },
        attributes,
      });
      router.push('/assets/' + res.data.data.assetId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create asset');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#0A0B0F] border border-[#1E2130] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00D4FF] transition-colors";
  const labelClass = "text-sm text-[#8892A4] mb-1 block";

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white">
      {/* Header */}
      <div className="border-b border-[#1E2130] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-[#00D4FF]" />
          <span className="font-bold">Dakhla<span className="text-[#00D4FF]">360</span></span>
        </div>
        <Link href="/explore" className="flex items-center gap-2 text-[#8892A4] hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Register Property</h1>
        <p className="text-[#8892A4] mb-8">Add your property to the blockchain verification network</p>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[
            { num: 1, label: 'Basic Info' },
            { num: 2, label: 'Property Details' },
            { num: 3, label: 'Legal & Pricing' },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className={'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ' +
                  (step >= s.num ? 'bg-[#00D4FF] text-black' : 'bg-[#1E2130] text-[#8892A4]')}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className={'text-sm ' + (step >= s.num ? 'text-white' : 'text-[#8892A4]')}>
                  {s.label}
                </span>
              </div>
              {i < 2 && <div className={'h-0.5 w-8 ' + (step > s.num ? 'bg-[#00D4FF]' : 'bg-[#1E2130]')} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Step 1 - Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-lg">Basic Information</h2>

              <div>
                <label className={labelClass}>Property Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. 3BHK Apartment in Koregaon Park"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Property Type *</label>
                <div className="grid grid-cols-4 gap-2">
                  {ASSET_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm({ ...form, type: t })}
                      className={'py-2 px-3 rounded-lg text-sm capitalize transition-all border ' +
                        (form.type === t
                          ? 'bg-[#00D4FF] text-black border-[#00D4FF] font-semibold'
                          : 'bg-[#0A0B0F] border-[#1E2130] text-[#8892A4] hover:border-[#00D4FF]/50')}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the property in detail — condition, unique features, history..."
                  rows={4}
                  className={inputClass + ' resize-none'}
                />
              </div>
            </div>

            <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-lg">Location</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Country</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>City *</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="e.g. Pune"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Full Address *</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Street, Area, Society name"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Pincode</label>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    placeholder="411001"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Landmark</label>
                  <input
                    type="text"
                    value={form.landmark}
                    onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                    placeholder="Near xyz"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!form.name || !form.city || !form.address) {
                  setError('Please fill name, city and address');
                  return;
                }
                setError('');
                setStep(2);
              }}
              className="w-full bg-[#00D4FF] text-black py-4 rounded-xl font-semibold hover:bg-[#00D4FF]/90 transition-all"
            >
              Next: Property Details →
            </button>
          </div>
        )}

        {/* Step 2 - Property Details */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-lg">Property Details</h2>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className={labelClass}>Property Size</label>
                  <input
                    type="number"
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    placeholder="1200"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Unit</label>
                  <select
                    value={form.sizeUnit}
                    onChange={(e) => setForm({ ...form, sizeUnit: e.target.value })}
                    className={inputClass}
                  >
                    <option>sq ft</option>
                    <option>sq mt</option>
                    <option>acres</option>
                    <option>gunta</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Bedrooms</label>
                  <select
                    value={form.bedrooms}
                    onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">Select</option>
                    {['1', '2', '3', '4', '5', '6+'].map(n => (
                      <option key={n} value={n}>{n} BHK</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Bathrooms</label>
                  <select
                    value={form.bathrooms}
                    onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">Select</option>
                    {['1', '2', '3', '4', '5+'].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Floor Number</label>
                  <input
                    type="number"
                    value={form.floors}
                    onChange={(e) => setForm({ ...form, floors: e.target.value })}
                    placeholder="e.g. 3"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Total Floors</label>
                  <input
                    type="number"
                    value={form.totalFloors}
                    onChange={(e) => setForm({ ...form, totalFloors: e.target.value })}
                    placeholder="e.g. 10"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Property Age (years)</label>
                  <input
                    type="number"
                    value={form.propertyAge}
                    onChange={(e) => setForm({ ...form, propertyAge: e.target.value })}
                    placeholder="e.g. 5"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Facing</label>
                  <select
                    value={form.facing}
                    onChange={(e) => setForm({ ...form, facing: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">Select</option>
                    {FACING_OPTIONS.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Furnishing Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {FURNISHING_OPTIONS.map(f => (
                    <button
                      key={f}
                      onClick={() => setForm({ ...form, furnishing: f })}
                      className={'py-2 px-3 rounded-lg text-sm transition-all border ' +
                        (form.furnishing === f
                          ? 'bg-[#00D4FF] text-black border-[#00D4FF] font-semibold'
                          : 'bg-[#0A0B0F] border-[#1E2130] text-[#8892A4] hover:border-[#00D4FF]/50')}
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
              {selectedAmenities.length > 0 && (
                <p className="text-xs text-[#00D4FF] mt-3">{selectedAmenities.length} amenities selected</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-[#1E2130] text-white py-4 rounded-xl font-semibold hover:border-[#00D4FF]/50 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-[#00D4FF] text-black py-4 rounded-xl font-semibold hover:bg-[#00D4FF]/90 transition-all"
              >
                Next: Legal & Pricing →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 - Legal & Pricing */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-lg">Legal Information</h2>

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
                      {status === 'Clear Title' || status === 'Government Approved' ? '✓ ' : '⚠ '}
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Government Registration Number</label>
                <input
                  type="text"
                  value={form.registrationNumber}
                  onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                  placeholder="e.g. MH-PN-2019-12345"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Number of Previous Owners</label>
                <select
                  value={form.previousOwners}
                  onChange={(e) => setForm({ ...form, previousOwners: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  {['0 (New)', '1', '2', '3', '4', '5+'].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-lg">Pricing</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Expected Price (₹)</label>
                  <input
                    type="number"
                    value={form.expectedPrice}
                    onChange={(e) => setForm({ ...form, expectedPrice: e.target.value })}
                    placeholder="e.g. 5000000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Price per sq ft (₹)</label>
                  <input
                    type="number"
                    value={form.pricePerSqFt}
                    onChange={(e) => setForm({ ...form, pricePerSqFt: e.target.value })}
                    placeholder="e.g. 8000"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setForm({ ...form, isNegotiable: !form.isNegotiable })}
                  className={'w-12 h-6 rounded-full transition-all ' +
                    (form.isNegotiable ? 'bg-[#00D4FF]' : 'bg-[#1E2130]')}
                >
                  <div className={'w-5 h-5 bg-white rounded-full transition-all mx-0.5 ' +
                    (form.isNegotiable ? 'translate-x-6' : 'translate-x-0')} />
                </button>
                <label className="text-sm text-[#8892A4]">Price is Negotiable</label>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-[#12141A] border border-[#00D4FF]/20 rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-4 text-[#00D4FF]">📋 Summary</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'Name', value: form.name },
                  { label: 'Type', value: form.type },
                  { label: 'City', value: form.city },
                  { label: 'Size', value: form.size ? form.size + ' ' + form.sizeUnit : '-' },
                  { label: 'Bedrooms', value: form.bedrooms || '-' },
                  { label: 'Legal Status', value: form.legalStatus },
                  { label: 'Price', value: form.expectedPrice ? '₹' + Number(form.expectedPrice).toLocaleString('en-IN') : '-' },
                  { label: 'Amenities', value: selectedAmenities.length + ' selected' },
                ].map(item => (
                  <div key={item.label} className="bg-[#0A0B0F] rounded-lg p-3">
                    <p className="text-xs text-[#8892A4]">{item.label}</p>
                    <p className="font-medium capitalize">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border border-[#1E2130] text-white py-4 rounded-xl font-semibold hover:border-[#00D4FF]/50 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-[#00D4FF] text-black py-4 rounded-xl font-semibold hover:bg-[#00D4FF]/90 disabled:opacity-50 transition-all"
              >
                {loading ? '🔗 Registering on Blockchain...' : '🔗 Register Property'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreateAssetPage() {
  return (
    <ProtectedRoute>
      <CreateAssetContent />
    </ProtectedRoute>
  );
}