import { Router } from 'express';
import { getProperties, getPropertyBySlug, createProperty, updateProperty, deleteProperty, getCategories, createCategory, updateCategory, deleteCategory, deletePropertyMedia, setPropertyThumbnail } from '../controllers/property.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { requireAgentOrAdmin, requireAdmin } from '../middlewares/role.middleware';

const router = Router();

// Public access: Lấy danh sách loại hình
router.get('/categories', getCategories);

// Admin access: Quản lý danh mục (CRUD)
router.post('/categories', verifyToken, requireAdmin, createCategory);
router.put('/categories/:id', verifyToken, requireAdmin, updateCategory);
router.delete('/categories/:id', verifyToken, requireAdmin, deleteCategory);

// Public access: Khách hàng tìm kiếm / xem nhà
router.get('/', getProperties);

// Public access: Xem chi tiết 1 bài đăng nhà bằng slug
router.get('/:slug', getPropertyBySlug);

// Agent/Admin access: Đăng bài, Sửa bài, Xóa bài (Soft delete)
router.post('/', verifyToken, requireAgentOrAdmin, createProperty);
router.put('/:id', verifyToken, requireAgentOrAdmin, updateProperty);
router.delete('/:id', verifyToken, requireAgentOrAdmin, deleteProperty);
router.delete('/media/:mediaId', verifyToken, requireAgentOrAdmin, deletePropertyMedia);
router.put('/media/:mediaId/thumbnail', verifyToken, requireAgentOrAdmin, setPropertyThumbnail);

export default router;