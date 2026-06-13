'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Search, Filter, Shield, Star, MapPin } from 'lucide-react';

const ASSET_TYPES = ['all', 'land', 'flat', 'house', 'commercial', 'car', 'bike', 'electronics', 'other'];

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

export default function ExplorePage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 12 };
      if (search) params.search = search;
      if (selectedType !== 'all') params.type = selectedType;

      const res = await axios.get('http://localhost:5000/api/v1/assets', { params });
      setAssets(res.data.data);
      setTotalPages(res.data.pagination.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [search, selectedType, page]);

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white">
      {/* Header */}
      <div className="border-b border-[#1E2130] px-6 py-4 flex items-center gap-2">
        <Shield className="w-6 h-6 text-[#00D4FF]" />
        <span className="font-bold text-lg">Dakhla<span className="text-[#00D4FF]">360</span></span>
        <span className="ml-4 text-[#8892A4]">/ Explore Assets</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Explore Assets</h1>
        <p className="text-[#8892A4] mb-8">Browse blockchain-verified assets</p>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#8892A4]" />
          <input
            type="text"
            placeholder="Search by name, ID, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#12141A] border border-[#1E2130] text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[#00D4FF] transition-colors"
          />
        </div>

        {/* Type Filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {ASSET_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => { setSelectedType(type); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                selectedType === type
                  ? 'bg-[#00D4FF] text-black'
                  : 'bg-[#12141A] border border-[#1E2130] text-[#8892A4] hover:border-[#00D4FF] hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Assets Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#12141A] border border-[#1E2130] rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : assets.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#8892A4] text-lg">No assets found</p>
            <Link href="/assets/create" className="text-[#00D4FF] hover:underline mt-2 inline-block">
              Register the first asset →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <Link key={asset._id} href={`/assets/${asset.assetId}`}>
                <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6 hover:border-[#00D4FF]/50 hover:shadow-lg hover:shadow-[#00D4FF]/5 transition-all cursor-pointer group">
                  {/* Type Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${TYPE_COLORS[asset.type] || TYPE_COLORS.other}`}>
                      {asset.type}
                    </span>
                    <span className="text-xs text-[#8892A4] font-mono">{asset.assetId}</span>
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00D4FF] transition-colors">
                    {asset.name}
                  </h3>

                  {/* Description */}
                  <p className="text-[#8892A4] text-sm mb-4 line-clamp-2">
                    {asset.description || 'No description provided'}
                  </p>

                  {/* Location */}
                  {asset.location?.city && (
                    <div className="flex items-center gap-1 text-[#8892A4] text-xs mb-4">
                      <MapPin className="w-3 h-3" />
                      {asset.location.city}, {asset.location.country}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#1E2130]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#00D4FF]/20 flex items-center justify-center">
                        <span className="text-xs text-[#00D4FF]">
                          {asset.owner?.name?.[0] || 'U'}
                        </span>
                      </div>
                      <span className="text-xs text-[#8892A4]">{asset.owner?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#00D4FF]" />
                      <span className="text-xs font-bold text-[#00D4FF]">{asset.trustScore}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                  page === i + 1
                    ? 'bg-[#00D4FF] text-black'
                    : 'bg-[#12141A] border border-[#1E2130] text-[#8892A4] hover:border-[#00D4FF]'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}