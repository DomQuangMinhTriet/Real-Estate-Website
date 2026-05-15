import { Router } from 'express';
import { getApprovedPosts, getPostById, getPendingPosts, createPost, approvePost, deletePost, getComments, createComment, deleteComment, toggleReaction, reportPost, getPendingReports, resolveReport } from '../controllers/forum.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';
import { forumRateLimiter } from '../middlewares/rate-limit.middleware';

const router = Router();

// Public access: Ai cũng có thể xem các bài viết đã được duyệt
router.get('/', getApprovedPosts);

// Admin access: Xem danh sách bài viết đang chờ duyệt
router.get('/pending', verifyToken, requireAdmin, getPendingPosts);

// Admin access: Xem danh sách bài bị báo cáo và Xử lý báo cáo
router.get('/reports/pending', verifyToken, requireAdmin, getPendingReports);
router.put('/reports/:reportId/resolve', verifyToken, requireAdmin, resolveReport);

// Public access: Xem chi tiết bài viết
router.get('/:id', getPostById);

// Member/Agent/Admin access: Đăng bài bị giới hạn 1 bài/phút bằng forumRateLimiter
router.post('/', verifyToken, forumRateLimiter, createPost);

// Admin access: Duyệt bài đăng
router.put('/:id/approve', verifyToken, requireAdmin, approvePost);
router.delete('/:id', verifyToken, requireAdmin, deletePost);

// Member access: Like và Báo cáo bài viết
router.post('/:postId/react', verifyToken, toggleReaction);
router.post('/:postId/report', verifyToken, reportPost);

// Public & Member access: Bình luận
router.get('/:postId/comments', getComments);
router.post('/:postId/comments', verifyToken, forumRateLimiter, createComment);

// Admin access: Xóa bình luận
router.delete('/comments/:commentId', verifyToken, requireAdmin, deleteComment);

export default router;