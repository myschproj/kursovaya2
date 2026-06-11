import { Router } from 'express';
import { listRules, createRule, updateRule, deleteRule } from '../controllers/dispatchRuleController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.get('/', authenticate, authorize('ADMIN', 'DISPATCHER'), asyncHandler(listRules));
router.post('/', authenticate, authorize('ADMIN'), asyncHandler(createRule));
router.put('/:id', authenticate, authorize('ADMIN'), asyncHandler(updateRule));
router.delete('/:id', authenticate, authorize('ADMIN'), asyncHandler(deleteRule));
export default router;
