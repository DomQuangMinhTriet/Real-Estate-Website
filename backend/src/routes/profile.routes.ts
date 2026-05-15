import { Router } from 'express';
import { getMyProfile, updateMyProfile, getAllProfiles, updateUserRole } from '../controllers/profile.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

// Yêu cầu đăng nhập để lấy và sửa hồ sơ cá nhân
router.get('/me', verifyToken, getMyProfile);
router.put('/me', verifyToken, updateMyProfile);

// Admin access: Quản lý người dùng
router.get('/', verifyToken, requireAdmin, getAllProfiles);
router.put('/:id/role', verifyToken, requireAdmin, updateUserRole);

export default router;