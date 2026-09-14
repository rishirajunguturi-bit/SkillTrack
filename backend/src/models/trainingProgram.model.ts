import mongoose, { Schema, Document } from 'mongoose';

export interface ITrainingProgram extends Document {
  title: string;
  provider: string;
  category: string;
  description?: string;
  duration: string; // e.g. "6 Months"
  enrolledCount: number;
  placementRate: number; // percentage (0-100)
  avgSalary: string; // e.g. "₹7.5 LPA"
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const trainingProgramSchema = new Schema<ITrainingProgram>(
  {
    title: { type: String, required: true, trim: true },
    provider: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, default: 'Technology' },
    description: { type: String, default: '' },
    duration: { type: String, required: true, default: '6 Months' },
    enrolledCount: { type: Number, default: 0 },
    placementRate: { type: Number, default: 85 },
    avgSalary: { type: String, default: '₹7.0 LPA' },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const TrainingProgram = mongoose.model<ITrainingProgram>('TrainingProgram', trainingProgramSchema);
