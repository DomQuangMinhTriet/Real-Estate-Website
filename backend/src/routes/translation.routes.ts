import { Router } from 'express';
import { 
  getTranslation, 
  approveTranslation, 
  getPendingTranslations, 
  updateTranslation 
} from '../controllers/translation.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

// Public: Lấy bản dịch của một entity (kèm cơ chế fallback thông minh)
router.get('/', getTranslation);

// Admin: Quản lý bản dịch
router.get('/pending', verifyToken, requireAdmin, getPendingTranslations);
router.put('/:id/approve', verifyToken, requireAdmin, approveTranslation);
router.put('/:id', verifyToken, requireAdmin, updateTranslation);

export default router;