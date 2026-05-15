-- Bảng leads (Khách hàng điền Form)
CREATE TABLE public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    message TEXT,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'new',
    notes TEXT -- Ghi chú nội bộ dành cho Admin/Agent theo dõi tiến độ
);

-- Bảng agent_requests (Yêu cầu đăng ký từ Agent/Broker)
CREATE TABLE public.agent_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    agent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    request_data JSONB, -- Linh hoạt lưu form đăng ký
    status TEXT DEFAULT 'pending'
);