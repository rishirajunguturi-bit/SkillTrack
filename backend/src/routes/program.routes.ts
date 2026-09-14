import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware';
import {
  getAdminPrograms,
  createProgram,
  updateProgram,
  toggleProgramStatus,
  getAdminCohorts,
  createCohort,
  updateCohort,
  toggleCohortStatus,
} from '../controllers/program.controller';

const router = Router();

// Protect ALL program & cohort routes with JWT Auth + ADMIN or TRAINER Role Authorization
router.use(authenticate, authorizeRoles('ADMIN', 'TRAINER'));

// Training Programs
router.get('/programs', getAdminPrograms);
router.post('/programs', createProgram);
router.put('/programs/:id', updateProgram);
router.delete('/programs/:id', toggleProgramStatus);

// Cohorts
router.get('/cohorts', getAdminCohorts);
router.post('/cohorts', createCohort);
router.put('/cohorts/:id', updateCohort);
router.delete('/cohorts/:id', toggleCohortStatus);

export default router;
