import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import WebSocket from 'ws';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Dùng service_role để backend có full quyền thao tác

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  throw new Error('❌ [Lỗi Cấu hình] SUPABASE_URL bị thiếu hoặc không hợp lệ. Vui lòng mở file backend/.env và điền URL thực tế của Supabase (bắt đầu bằng https://).');
}

if (!supabaseServiceKey) {
  throw new Error('❌ [Lỗi Cấu hình] SUPABASE_SERVICE_ROLE_KEY bị thiếu. Vui lòng kiểm tra lại file backend/.env');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false // Vô hiệu hóa tính năng lưu session (vì Backend không có localStorage như trình duyệt)
  },
  realtime: {
    transport: WebSocket as any // Cung cấp WebSocket transport cho Node.js < 22
  }
});