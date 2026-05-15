import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

/**
 * Lấy danh sách lịch sử thao tác hệ thống (Dành cho Admin)
 */
export const getSystemLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('system_logs')
      .select('*, profiles(full_name, email, role)')
      .order('created_at', { ascending: false })
      .limit(200); // Lấy 200 hành động gần nhất
    if (error) throw error;
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};