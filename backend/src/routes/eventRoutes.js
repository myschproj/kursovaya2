import { Router } from 'express';
import { listEvents } from '../controllers/eventController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.get('/', authenticate, authorize('ADMIN', 'DISPATCHER', 'TECHNICIAN'), asyncHandler(listEvents));
export default router;
