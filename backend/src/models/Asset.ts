import mongoose, { Document, Schema } from 'mongoose';

export interface IAsset extends Document {
  assetId: string;
  name: string;
  type: 'land' | 'flat' | 'house' | 'commercial' | 'car' | 'bike' | 'electronics' | 'other';
  description: string;
  owner: mongoose.Types.ObjectId;
  ownershipHistory: {
    owner: mongoose.Types.ObjectId;
    acquiredAt: Date;
    transferredAt?: Date;
    txHash?: string;
  }[];
  location: {
    country: string;
    city: string;
    address: string;
  };
  attributes: Map<string, any>;
  documents: {
    name: string;
    ipfsHash: string;
    uploadedAt: Date;
    uploadedBy: mongoose.Types.ObjectId;
  }[];
  images: string[];
  status: 'active' | 'transferred' | 'disputed' | 'archived';
  trustScore: number;
  isVerified: boolean;
  verifiedBy: mongoose.Types.ObjectId[];
  algorandTxHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssetSchema = new Schema<IAsset>(
  {
    assetId: { type: String, unique: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['land', 'flat', 'house', 'commercial', 'car', 'bike', 'electronics', 'other'],
      required: true,
    },
    description: { type: String, default: '' },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ownershipHistory: [
      {
        owner: { type: Schema.Types.ObjectId, ref: 'User' },
        acquiredAt: { type: Date, default: Date.now },
        transferredAt: { type: Date },
        txHash: { type: String },
      },
    ],
    location: {
      country: { type: String, default: '' },
      city: { type: String, default: '' },
      address: { type: String, default: '' },
    },
    attributes: { type: Map, of: Schema.Types.Mixed, default: {} },
    documents: [
      {
        name: { type: String },
        ipfsHash: { type: String },
        uploadedAt: { type: Date, default: Date.now },
        uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    images: [{ type: String }],
    status: {
      type: String,
      enum: ['active', 'transferred', 'disputed', 'archived'],
      default: 'active',
    },
    trustScore: { type: Number, default: 0, min: 0, max: 100 },
    isVerified: { type: Boolean, default: false },
    verifiedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    algorandTxHash: { type: String },
  },
  { timestamps: true }
);

AssetSchema.pre('save', function (next) {
  if (!this.assetId) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'DKL-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.assetId = result;
  }
  next();
});

AssetSchema.index({ assetId: 1 });
AssetSchema.index({ owner: 1 });
AssetSchema.index({ type: 1 });
AssetSchema.index({ trustScore: -1 });

export default mongoose.model<IAsset>('Asset', AssetSchema);