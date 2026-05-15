import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

// Mở rộng Interface Request của Express để lưu thông tin user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        role: string;
      };
    }
  }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: Missing or invalid token format', code: 401 });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    // Xác thực token với Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: 'Unauthorized: Invalid or expired token', code: 401 });
      return;
    }

    // Lấy Role từ bảng profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Gán vào req.user để các middleware hoặc controller sau có thể sử dụng
    req.user = {
      id: user.id,
      email: user.email,
      role: profile?.role || 'member'
    };

    next();
  } catch (error) {
    next(error);
  }
};