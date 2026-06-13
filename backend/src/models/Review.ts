import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  asset: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  body: string;
  tags: string[];
  isVerified: boolean;
  upvotes: mongoose.Types.ObjectId[];
  downvotes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    asset: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, default: '' },
    body: { type: String, required: true, minlength: 10 },
    tags: [{ type: String }],
    isVerified: { type: Boolean, default: false },
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

ReviewSchema.index({ asset: 1, reviewer: 1 }, { unique: true });

export default mongoose.model<IReview>('Review', ReviewSchema);