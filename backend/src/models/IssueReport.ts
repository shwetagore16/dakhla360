import mongoose, { Document, Schema } from 'mongoose';

export interface IIssueReport extends Document {
  asset: mongoose.Types.ObjectId;
  reporter: mongoose.Types.ObjectId;
  type: 'fraud' | 'dispute' | 'damage' | 'legal' | 'stolen' | 'other';
  title: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: Date;
  updatedAt: Date;
}

const IssueReportSchema = new Schema<IIssueReport>(
  {
    asset: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['fraud', 'dispute', 'damage', 'legal', 'stolen', 'other'],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['open', 'investigating', 'resolved', 'dismissed'],
      default: 'open',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IIssueReport>('IssueReport', IssueReportSchema);