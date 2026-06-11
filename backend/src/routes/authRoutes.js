import { Router } from 'express';
import { login, me, register } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.post('/login', asyncHandler(login));
router.post('/register', asyncHandler(register));
router.get('/me', authenticate, me);
export default router;
