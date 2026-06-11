import { Router } from 'express';
import { listElevators, createElevator, updateElevator, deleteElevator } from '../controllers/elevatorController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.get('/', authenticate, asyncHandler(listElevators));
router.post('/', authenticate, authorize('ADMIN'), asyncHandler(createElevator));
router.put('/:id', authenticate, authorize('ADMIN', 'DISPATCHER', 'TECHNICIAN'), asyncHandler(updateElevator));
router.delete('/:id', authenticate, authorize('ADMIN'), asyncHandler(deleteElevator));
export default router;
