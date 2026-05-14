-- Bảng translations (Xử lý Đa ngôn ngữ Backend)
CREATE TABLE public.translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    entity_type TEXT NOT NULL, -- Ví dụ: 'property', 'project'
    entity_id UUID NOT NULL,
    lang_code TEXT NOT NULL, -- Ví dụ: 'en', 'zh'
    translation_data JSONB NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    UNIQUE(entity_type, entity_id, lang_code)
);