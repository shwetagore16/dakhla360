import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  walletAddress?: string;
  avatar?: string;
  role: 'user' | 'verifier' | 'admin';
  reputation: {
    score: number;
    totalReviews: number;
    totalVerifications: number;
  };
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false, minlength: 6 },
    walletAddress: { type: String, unique: true, sparse: true },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'verifier', 'admin'], default: 'user' },
    reputation: {
      score: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
      totalVerifications: { type: Number, default: 0 },
    },
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);