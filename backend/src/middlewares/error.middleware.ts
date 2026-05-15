import { Request, Response, NextFunction } from 'express';

// Middleware xử lý lỗi chuẩn chỉnh
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('[Error]:', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    code: statusCode
  });
};