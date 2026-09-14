import mongoose, { Schema, Document } from 'mongoose';

export interface IAiUsage extends Document {
  userId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD UTC date string
  requestsUsed: number;
  requestsLimit: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  createdAt: Date;
  updatedAt: Date;
}

const aiUsageSchema = new Schema<IAiUsage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true, index: true }, // Format: YYYY-MM-DD
    requestsUsed: { type: Number, default: 0, min: 0 },
    requestsLimit: { type: Number, default: 20, min: 1 },
    inputTokens: { type: Number, default: 0, min: 0 },
    outputTokens: { type: Number, default: 0, min: 0 },
    totalTokens: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// Compound index to guarantee one usage document per user per day
aiUsageSchema.index({ userId: 1, date: 1 }, { unique: true });

export const AiUsage = mongoose.model<IAiUsage>('AiUsage', aiUsageSchema);
