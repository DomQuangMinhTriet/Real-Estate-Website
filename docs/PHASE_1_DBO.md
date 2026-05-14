# 🏁 CHỐT SỔ GIAI ĐOẠN 1: DBO (Database Objects & Security)

**Trạng thái:** Hoàn thành ✅

Tài liệu này tổng kết các thành quả đã đạt được trong Giai đoạn 1 của dự án Pro-RealEstate, tập trung vào việc thiết lập Cơ sở dữ liệu (Supabase PostgreSQL), thiết kế lược đồ, phân quyền và bảo mật tại gốc (Row Level Security).

## 1. Danh sách Database Scripts đã thực thi
Hệ thống cơ sở dữ liệu đã được triển khai đầy đủ thông qua 7 tệp script SQL theo thứ tự chuẩn:

1.  `01_setup_users.sql`: Cấu hình Enum `user_role`, bảng `profiles`, `agent_profiles` và Trigger đồng bộ Supabase Auth.
2.  `02_setup_projects.sql`: Khởi tạo bảng `projects` quản lý thông tin dự án, cấu hình Theme ID.
3.  `03_setup_properties.sql`: Thiết lập bảng cốt lõi `properties` với kiểu dữ liệu `JSONB` linh hoạt, `categories` và `property_media`.
4.  `04_setup_leads.sql`: Khởi tạo hệ thống CRM thu thập khách hàng (`leads`) và tiếp nhận yêu cầu đăng ký môi giới (`agent_requests`).
5.  `05_setup_forum.sql`: Khởi tạo bảng `forum_posts` và `forum_comments` hỗ trợ tính năng duyệt (Pending/Approved).
6.  `06_setup_translations.sql`: Tạo cấu trúc lưu trữ đa ngôn ngữ linh hoạt dạng Key-Value (Polymorphic association).
7.  `07_setup_rls_policies.sql`: Thiết lập và kích hoạt bảo mật mức dòng (RLS).

## 2. Điểm nhấn Kiến trúc (Key Architectural Highlights)

### 2.1. Tự động hóa Quản lý Người dùng (Auth Triggers)
- Đã thiết lập Trigger `on_auth_user_created` và hàm `handle_new_user()`.
- **Luồng hoạt động:** Khi một người dùng mới đăng ký qua module Authentication của Supabase, trigger sẽ tự động đọc dữ liệu từ `raw_user_meta_data`, sau đó tự động khởi tạo một bản ghi tương ứng trong bảng `public.profiles` kèm theo Role mặc định là `member`.

### 2.2. Dữ liệu linh hoạt với cấu trúc JSONB
- Cột `attributes` trong bảng `properties` đã được ứng dụng kiểu dữ liệu **JSONB**.
- **Tối ưu hóa:** Bảng đã được đánh index `GIN (attributes)`. Điều này cho phép nền tảng dễ dàng mở rộng các trường dữ liệu (ví dụ: căn hộ có "số phòng ngủ", nhưng đất nền lại có "hướng đất", "mặt tiền") mà không cần phải thay đổi cấu trúc bảng cứng (ALTER TABLE). Tốc độ query bộ lọc vẫn được đảm bảo.

### 2.3. Bức tường lửa RLS (Row Level Security)
Toàn bộ dữ liệu quan trọng đều được chặn truy cập trái phép ngay từ cấp độ DB, giúp hệ thống an toàn ngay cả khi API Backend có lỗ hổng rò rỉ:
- **Bảng `properties`:** Public được quyền `SELECT` (chỉ những bài chưa bị xóa `is_deleted = false`). Chỉ `admin` và `agent` có token hợp lệ mới được quyền `INSERT`. Quyền `UPDATE/DELETE` bị hạn chế nghiêm ngặt, chỉ dành cho `admin` hoặc chủ sở hữu bài đăng (`created_by = auth.uid()`).
- **Bảng `leads`:** Bất kỳ ai truy cập website cũng được quyền gửi form (`INSERT`). Tuy nhiên, quyền `SELECT` bị vô hiệu hóa hoàn toàn với người dùng thường/khách vãng lai. Chỉ `admin` hoặc `agent` được gán phụ trách (`agent_id`) mới nhìn thấy thông tin khách hàng.

---

## 3. Tài liệu liên kết

Giai đoạn thiết lập Database đã khép lại thành công. Để xem chi tiết mô tả từng bảng (Tables), kiểu dữ liệu (Data Types) và sơ đồ quan hệ (ERD), đội ngũ phát triển (Frontend/Backend) vui lòng tham khảo tài liệu kỹ thuật sau:

👉 **Chi tiết Database Schema & RLS**

*Sẵn sàng tiến tới Giai đoạn 2: Phát triển Tầng BUS (Backend Node.js).*