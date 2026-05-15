import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { logAction } from '../services/log.service';

/**
 * Lấy hồ sơ của User đang đăng nhập (bao gồm cả agent_profiles nếu là agent)
 */
export const getMyProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*, agent_profiles(*)')
      .eq('id', userId)
      .single();

    if (error) throw error;
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật hồ sơ cá nhân
 */
export const updateMyProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    const { full_name, phone, avatar_url, experience_years, assigned_area, certificates } = req.body;

    // 1. Cập nhật bảng profiles
    const { error: profileError } = await supabase.from('profiles').update({ full_name, phone, avatar_url, updated_at: new Date() }).eq('id', userId);
    if (profileError) throw profileError;

    // 2. Nếu là Agent, cập nhật thêm bảng agent_profiles
    if (role === 'agent') {
      const { error: agentError } = await supabase.from('agent_profiles').upsert({ profile_id: userId, experience_years, assigned_area, certificates }, { onConflict: 'profile_id' });
      if (agentError) throw agentError;
    }

    if (userId) await logAction(userId, 'UPDATE_PROFILE', `Updated their own profile`);
    
    res.status(200).json({ status: 'success', message: 'Cập nhật hồ sơ thành công!' });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy danh sách toàn bộ người dùng (Dành cho Admin)
 */
export const getAllProfiles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, agent_profiles(*)')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin thay đổi Role của người dùng (Thăng cấp / Giáng cấp)
 */
export const updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const adminId = req.user?.id;

    // Validate role hợp lệ trước khi đẩy xuống DB để tránh lỗi 500 Enum Error
    const validRoles = ['admin', 'agent', 'member'];
    if (!validRoles.includes(role)) {
      res.status(400).json({ error: 'Role không hợp lệ. Chỉ chấp nhận: admin, agent, member', code: 400 });
      return;
    }

    const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
    if (error) throw error;
    
    if (adminId) await logAction(adminId, 'UPDATE_USER_ROLE', `Updated user ID: ${id} to role: ${role}`);
    res.status(200).json({ status: 'success', message: 'Cập nhật phân quyền thành công!' });
  } catch (error) {
    next(error);
  }
};