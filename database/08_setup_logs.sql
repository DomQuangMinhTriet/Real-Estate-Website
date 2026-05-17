-- Bảng system_logs để lưu vết các hành động nhạy cảm
CREATE TABLE public.system_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details TEXT
);

-- Bảo mật: Chỉ Admin mới có quyền xem logs, không ai được sửa/xóa logs
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Logs viewable by Admin only" 
ON public.system_logs FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);

-- Cho phép backend ghi log thay cho các user đã xác thực
CREATE POLICY "Logs insertable by authenticated users" 
ON public.system_logs FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');
-- Lưu ý: Backend sẽ dùng Service Role (Bỏ qua RLS) để INSERT dữ liệu log