-- Bật tính năng Row Level Security (RLS)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- POLICIES CHO PROPERTIES
-- ==========================================
-- SELECT: Public chỉ thấy bài chưa xóa. Admin và Tác giả được thấy toàn bộ để tránh lỗi khi Soft Delete.
CREATE POLICY "Properties viewable by public" 
ON public.properties FOR SELECT USING (
    is_deleted = false 
    OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin') 
    OR auth.uid() = created_by
);

-- INSERT: Chỉ authenticated role là Admin hoặc Agent
CREATE POLICY "Properties insertable by Admin or Agent" 
ON public.properties FOR INSERT 
WITH CHECK (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'agent'))
);

-- UPDATE & DELETE: Chỉ Admin hoặc người có ID trùng với created_by (chủ bài đăng)
CREATE POLICY "Properties updatable by Admin or Creator" 
ON public.properties FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin') OR auth.uid() = created_by
);
CREATE POLICY "Properties deletable by Admin or Creator" 
ON public.properties FOR DELETE USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin') OR auth.uid() = created_by
);

-- ==========================================
-- POLICIES CHO LEADS
-- ==========================================
-- INSERT: Public (Bất kỳ ai cũng có thể điền form)
CREATE POLICY "Leads insertable by public" 
ON public.leads FOR INSERT WITH CHECK (true);

-- SELECT: Admin hoặc Agent (chỉ xem được leads thuộc về mình)
CREATE POLICY "Leads viewable by Admin or Assigned Agent" 
ON public.leads FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin') OR auth.uid() = agent_id
);

-- UPDATE: Admin hoặc Agent được gán
CREATE POLICY "Leads updatable by Admin or Assigned Agent" 
ON public.leads FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin') OR auth.uid() = agent_id
);