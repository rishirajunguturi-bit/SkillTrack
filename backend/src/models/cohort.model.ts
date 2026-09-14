import mongoose, { Schema, Document } from 'mongoose';

export interface ICohort extends Document {
  name: string;
  programId?: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  maxCapacity: number;
  currentEnrolled: number;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

const cohortSchema = new Schema<ICohort>(
  {
    name: { type: String, required: true, trim: true },
    programId: { type: Schema.Types.ObjectId, ref: 'TrainingProgram', index: true },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date, required: true },
    maxCapacity: { type: Number, default: 50 },
    currentEnrolled: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['UPCOMING', 'ACTIVE', 'COMPLETED', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true,
    },
  },
  { timestamps: true }
);

export const Cohort = mongoose.model<ICohort>('Cohort', cohortSchema);
