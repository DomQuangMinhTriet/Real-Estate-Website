-- Khai báo Enum cho user_role
CREATE TYPE user_role AS ENUM ('admin', 'agent', 'member');

-- Bảng profiles liên kết trực tiếp với auth.users của Supabase
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'member'::user_role,
    phone TEXT
);

-- Bảng agent_profiles: Thông tin chuyên sâu của Agent
CREATE TABLE public.agent_profiles (
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    experience_years INTEGER DEFAULT 0,
    assigned_area TEXT,
    certificates TEXT
);

-- Trigger tự động: Chèn dữ liệu vào bảng profiles khi user đăng ký qua Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_role public.user_role := 'member'::public.user_role;
BEGIN
    -- Gán an toàn: Chỉ đổi role nếu metadata thực sự có chứa giá trị hợp lệ
    IF new.raw_user_meta_data->>'role' = 'admin' THEN
        default_role := 'admin'::public.user_role;
    ELSIF new.raw_user_meta_data->>'role' = 'agent' THEN
        default_role := 'agent'::public.user_role;
    END IF;

    INSERT INTO public.profiles (id, full_name, role)
    VALUES (new.id, new.raw_user_meta_data->>'full_name', default_role);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();