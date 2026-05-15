import { Request, Response, NextFunction } from 'express';

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden: Admin access required', code: 403 });
    return;
  }
  next();
};

export const requireAgentOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || (req.user.role !== 'agent' && req.user.role !== 'admin')) {
    res.status(403).json({ error: 'Forbidden: Agent or Admin access required', code: 403 });
    return;
  }
  next();
};

/**
 * Hàm hỗ trợ kiểm tra quyền chỉnh sửa Bất Động Sản (dùng trong Controller)
 * @param user req.user lấy từ auth.middleware
 * @param propertyCreatedBy ID của người tạo bài viết
 * @returns true nếu có quyền, false nếu không
 */
export const canEditProperty = (user: any, propertyCreatedBy: string): boolean => {
  if (!user) return false;
  if (user.role === 'admin') return true; // Admin có toàn quyền
  if (user.role === 'agent' && user.id === propertyCreatedBy) return true; // Agent chỉ sửa được bài của mình
  return false;
};