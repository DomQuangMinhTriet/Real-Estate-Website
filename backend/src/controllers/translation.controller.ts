import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { logAction } from '../services/log.service';

/**
 * Lấy bản dịch của một Entity (Property/Project). Có tích hợp Fallback.
 */
export const getTranslation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { entity_type, entity_id, lang_code } = req.query;

    if (!entity_type || !entity_id || !lang_code) {
      res.status(400).json({ error: 'Missing required parameters (entity_type, entity_id, lang_code)', code: 400 });
      return;
    }

    // 1. Tìm bản dịch trong DB
    const { data: translation, error } = await supabase
      .from('translations')
      .select('*')
      .eq('entity_type', entity_type as string)
      .eq('entity_id', entity_id as string)
      .eq('lang_code', lang_code as string)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 là lỗi không tìm thấy dòng nào
      throw error;
    }

    // 2. CƠ CHẾ FALLBACK: Nếu không có bản dịch hoặc bản dịch CƯA ĐƯỢC DUYỆT
    if (!translation || !translation.is_approved) {
      let originalData = null;
      
      // Tự động lấy bản gốc tiếng Việt từ bảng tương ứng làm fallback
      if (entity_type === 'property') {
        const { data } = await supabase.from('properties').select('title, description').eq('id', entity_id as string).single();
        originalData = data;
      } else if (entity_type === 'project') {
        const { data } = await supabase.from('projects').select('name, description').eq('id', entity_id as string).single();
        // Đổi key 'name' thành 'title' cho đồng bộ cấu trúc với property ở Frontend
        if (data) {
          originalData = { title: data.name, description: data.description };
        }
      }

      res.status(200).json({ 
        status: 'success', 
        message: 'Bản dịch chưa sẵn sàng. Fallback về ngôn ngữ gốc.',
        fallback: true,
        data: originalData 
      });
      return;
    }

    res.status(200).json({ status: 'success', fallback: false, data: translation.translation_data });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy danh sách các bản dịch đang chờ duyệt (Pending Translations) dành cho Admin
 */
export const getPendingTranslations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('translations')
      .select('*')
      .eq('is_approved', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin duyệt bản dịch máy (Approve)
 */
export const approveTranslation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const adminId = req.user?.id;

    const { data, error } = await supabase
      .from('translations')
      .update({ is_approved: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (adminId) await logAction(adminId, 'APPROVE_TRANSLATION', `Approved translation ID: ${id}`);

    res.status(200).json({ status: 'success', message: 'Duyệt bản dịch thành công!', data });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật nội dung bản dịch (Admin tự sửa lại nếu máy dịch sai và tự động duyệt)
 */
export const updateTranslation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { translation_data } = req.body;
    const adminId = req.user?.id;

    const { data, error } = await supabase.from('translations').update({ translation_data, is_approved: true }).eq('id', id).select().single();

    if (error) throw error;
    if (adminId) await logAction(adminId, 'UPDATE_TRANSLATION', `Updated and approved translation ID: ${id}`);

    res.status(200).json({ status: 'success', message: 'Cập nhật và duyệt bản dịch thành công!', data });
  } catch (error) {
    next(error);
  }
};