'use client';
import { useState, useRef } from 'react';
import axios from 'axios';

interface Props {
  assetId: string;
  onUploadComplete: (hashes: string[]) => void;
}

export default function ImageUpload({ assetId, onUploadComplete }: Props) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    setFiles(selected);
    const urls = selected.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    setError('');
    setSuccess('');
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      files.forEach(f => formData.append('images', f));

      const res = await axios.post(
        `http://localhost:5000/api/v1/assets/${assetId}/images`,
        formData,
        {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setSuccess('Images uploaded to IPFS successfully!');
      onUploadComplete(res.data.data);
      setFiles([]);
      setPreviews([]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#12141A] border border-[#1E2130] rounded-xl p-6">
      <h3 className="font-semibold text-lg mb-4">📸 Property Photos</h3>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-lg mb-4 text-sm">
          ✅ {success}
        </div>
      )}

      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[#1E2130] hover:border-[#00D4FF]/50 rounded-xl p-8 text-center cursor-pointer transition-all mb-4"
      >
        <div className="text-4xl mb-2">📁</div>
        <p className="text-[#8892A4] text-sm">Click to select images</p>
        <p className="text-[#8892A4]/50 text-xs mt-1">JPG, PNG, WEBP up to 10MB each (max 10 images)</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {previews.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
              <img src={url} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-xs text-white px-2 py-1 truncate">
                {files[i]?.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-[#00D4FF] text-black py-3 rounded-xl font-semibold hover:bg-[#00D4FF]/90 disabled:opacity-50 transition-all"
        >
          {uploading ? '⬆️ Uploading to IPFS...' : `⬆️ Upload ${files.length} Image${files.length > 1 ? 's' : ''} to IPFS`}
        </button>
      )}
    </div>
  );
}