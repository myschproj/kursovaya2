import { Router } from 'express';
import { listCalls, createCall, getCall, cancelCall } from '../controllers/callController.js';
import { authenticate } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(authenticate);
router.get('/', asyncHandler(listCalls));
router.post('/', asyncHandler(createCall));
router.get('/:id', asyncHandler(getCall));
router.patch('/:id/cancel', asyncHandler(cancelCall));
export default router;
