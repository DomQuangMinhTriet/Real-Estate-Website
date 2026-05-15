import { supabase } from '../config/supabase';

/**
 * Ghi log thao tác của Admin/Agent vào hệ thống Database
 */
export const logAction = async (userId: string, action: string, details: string): Promise<void> => {
  try {
    console.log(`[System Log] User: ${userId} | Action: ${action} | Details: ${details}`);
    
    const { error } = await supabase.from('system_logs').insert({
      user_id: userId,
      action: action,
      details: details
    });

    if (error) {
      console.error('[System Log] Database insertion error:', error.message);
    }
  } catch (error) {
    console.error('[System Log] Unexpected error logging action:', error);
  }
};