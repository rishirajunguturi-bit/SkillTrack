import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { TrainingProgram } from '../models/trainingProgram.model';
import { Cohort } from '../models/cohort.model';
import { ApiError } from '../utils/apiError';

// Training Programs CRUD
export const getAdminPrograms = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let programs = await TrainingProgram.find().sort({ createdAt: -1 });
    
    // Seed default programs if database collection is empty
    if (programs.length === 0) {
      programs = await TrainingProgram.insertMany([
        {
          title: 'Computer Science & AI Skilling',
          provider: 'National Skilling Center',
          category: 'Technology',
          description: 'Comprehensive AI, Data Structures & Algorithm skilling curriculum.',
          duration: '6 Months',
          enrolledCount: 45,
          placementRate: 88,
          avgSalary: '₹7.5 LPA',
          isActive: true,
        },
        {
          title: 'Data Engineering & Analytics',
          provider: 'IIT Madras Skilling Hub',
          category: 'Data / AI',
          description: 'Big data pipelines, SQL, Python & Analytics.',
          duration: '4 Months',
          enrolledCount: 32,
          placementRate: 82,
          avgSalary: '₹6.8 LPA',
          isActive: true,
        },
        {
          title: 'Full-Stack Web Development',
          provider: 'Tech Skills Academy',
          category: 'Web Development',
          description: 'Modern MERN & Next.js full-stack engineering.',
          duration: '6 Months',
          enrolledCount: 50,
          placementRate: 91,
          avgSalary: '₹8.2 LPA',
          isActive: true,
        },
        {
          title: 'Cloud Infrastructure & DevOps',
          provider: 'Apex Technical Institute',
          category: 'Cloud / DevOps',
          description: 'Docker, Kubernetes, AWS & CI/CD deployment automation.',
          duration: '3 Months',
          enrolledCount: 28,
          placementRate: 79,
          avgSalary: '₹6.5 LPA',
          isActive: true,
        },
      ]);
    }

    res.status(200).json({
      success: true,
      data: { programs },
    });
  } catch (error) {
    next(error);
  }
};

export const createProgram = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const program = await TrainingProgram.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Training program created successfully',
      data: { program },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProgram = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const program = await TrainingProgram.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!program) throw new ApiError(404, 'Training program not found');
    res.status(200).json({
      success: true,
      message: 'Training program updated successfully',
      data: { program },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleProgramStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const program = await TrainingProgram.findById(req.params.id);
    if (!program) throw new ApiError(404, 'Training program not found');
    program.isActive = !program.isActive;
    await program.save();
    res.status(200).json({
      success: true,
      message: `Program status updated to ${program.isActive ? 'Active' : 'Inactive'}`,
      data: { program },
    });
  } catch (error) {
    next(error);
  }
};

// Cohorts CRUD
export const getAdminCohorts = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let cohorts = await Cohort.find().populate('programId', 'title provider').sort({ createdAt: -1 });

    if (cohorts.length === 0) {
      const defaultProgram = await TrainingProgram.findOne();
      const programId = defaultProgram ? defaultProgram._id : undefined;

      const now = new Date();
      const sixMonths = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);

      cohorts = await Cohort.insertMany([
        {
          name: 'Batch 2026-A (Alpha)',
          programId,
          startDate: now,
          endDate: sixMonths,
          maxCapacity: 60,
          currentEnrolled: 48,
          status: 'ACTIVE',
        },
        {
          name: 'Batch 2026-B (Beta)',
          programId,
          startDate: now,
          endDate: sixMonths,
          maxCapacity: 50,
          currentEnrolled: 35,
          status: 'ACTIVE',
        },
      ]) as any;
    }

    res.status(200).json({
      success: true,
      data: { cohorts },
    });
  } catch (error) {
    next(error);
  }
};

export const createCohort = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cohort = await Cohort.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Cohort created successfully',
      data: { cohort },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCohort = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cohort = await Cohort.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cohort) throw new ApiError(404, 'Cohort not found');
    res.status(200).json({
      success: true,
      message: 'Cohort updated successfully',
      data: { cohort },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleCohortStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cohort = await Cohort.findById(req.params.id);
    if (!cohort) throw new ApiError(404, 'Cohort not found');
    cohort.status = cohort.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE';
    await cohort.save();
    res.status(200).json({
      success: true,
      message: `Cohort status updated to ${cohort.status}`,
      data: { cohort },
    });
  } catch (error) {
    next(error);
  }
};
