import { Router } from 'express';
import { listUsers, createUser, updateUser, deleteUser, listRoles } from '../controllers/userController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(authenticate, authorize('ADMIN'));
router.get('/roles', asyncHandler(listRoles));
router.get('/', asyncHandler(listUsers));
router.post('/', asyncHandler(createUser));
router.put('/:id', asyncHandler(updateUser));
router.delete('/:id', asyncHandler(deleteUser));
export default router;
