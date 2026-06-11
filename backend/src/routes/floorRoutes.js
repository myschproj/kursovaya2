import { Router } from 'express';
import { listFloors, createFloor, updateFloor, deleteFloor } from '../controllers/floorController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.get('/', authenticate, asyncHandler(listFloors));
router.post('/', authenticate, authorize('ADMIN'), asyncHandler(createFloor));
router.put('/:id', authenticate, authorize('ADMIN'), asyncHandler(updateFloor));
router.delete('/:id', authenticate, authorize('ADMIN'), asyncHandler(deleteFloor));
export default router;
