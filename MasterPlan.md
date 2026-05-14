# 📋 MASTER CHECKLIST: DỰ ÁN WEBSITE BẤT ĐỘNG SẢN ĐA THEME (FULL CẤU TRÚC)

---

## 🏗️ GIAI ĐOẠN 1: DBO - KHỞI TẠO CƠ SỞ DỮ LIỆU & BẢO MẬT TẠI GỐC (SUPABASE)

*(Tác vụ: Chạy các file SQL này trực tiếp trên SQL Editor của Supabase)*

### 1.1. Cấu hình User, Phân quyền (Auth) & Hệ thống User & Role (Identity)

* [x] Tạo file `database/01_setup_users.sql`.
* [x] Viết script tạo bảng `public.users` liên kết với `auth.users` của Supabase.
* [x] Khai báo Enum `user_role` (`'admin'`, `'agent'`, `'member'`).
* [x] Chạy file `01_setup_users.sql` trên Supabase.
* [x] **Table profiles**: Gồm `id`, `updated_at`, `username`, `full_name`, `avatar_url`, `role` (enum), `phone`.
* [x] **Trigger tự động**: Viết Function và Trigger trên Supabase để khi một User đăng ký qua Auth, dữ liệu tự động chèn vào bảng `profiles`.
* [x] **Bảng agent_profiles**: Lưu thông tin chuyên sâu của Agent (số năm kinh nghiệm, khu vực phụ trách, bằng cấp).

### 1.2. Tạo bảng Quản lý Dự án & Cấu trúc Bất động sản cốt lõi (The Core)

* [x] Tạo file `database/02_setup_projects.sql`.
* [x] Viết script tạo bảng `projects` (`theme_id`, `name`,...).
* [x] Tạo file `database/03_setup_properties.sql`.
* [x] Viết script tạo bảng `properties`.
* [x] **[QUAN TRỌNG]** Khai báo cột `attributes` với kiểu dữ liệu `JSONB` để lưu linh hoạt Căn hộ/Nhà phố.
* [x] Chạy file 02 và 03 trên Supabase.
* [x] **Bảng categories**: Để bạn có thể thêm các loại hình khác sau này (Căn hộ, Đất nền...).
* [x] **Bảng properties (Chi tiết CRUD)**:
* [x] Ràng buộc (Constraints): `price > 0`, `slug` là duy nhất.
* [x] Metadata: `created_by` (Lưu ID người tạo - Admin/Agent).
* [x] Thuộc tính động: Thiết lập Index cho cột `attributes` (JSONB) để tìm kiếm nhanh.
* [x] **Bảng property_media**: Lưu danh sách ảnh/video cho mỗi BĐS (tránh dồn quá nhiều text vào bảng chính).

### 1.3. Tạo bảng CRM (Leads) & Agent

* [x] Tạo file `database/04_setup_leads.sql`.
* [x] Viết script tạo bảng `leads` (khách hàng điền form). Set Foreign Key `agent_id` và `property_id`.
* [x] Viết script tạo bảng `agent_requests` (chứa cột `request_data` JSONB để lưu form linh hoạt).
* [x] Chạy file 04.

### 1.4. Tạo bảng Diễn đàn & Đa ngôn ngữ

* [x] Tạo file `database/05_setup_forum.sql`.
* [x] Viết script tạo bảng `forum_posts` và `forum_comments`.
* [x] Tạo file `database/06_setup_translations.sql`.
* [x] Viết script tạo bảng `translations` lưu cặp Key-Value.
* [x] Chạy file 05 và 06.

### 1.5. Thiết lập Bảo mật CSDL (Row Level Security - RLS) - "Bức tường lửa"

* [x] Tạo file `database/07_setup_rls_policies.sql`.
* [x] Viết Policy: Bật RLS cho tất cả các bảng.
* [x] Viết Policy cho bảng `properties`: Admin (ALL). Agent (SELECT, UPDATE WHERE `agent_id = auth.uid()`).
* [x] Viết Policy cho bảng `leads`: Tương tự như properties.
* [x] Chạy file 07.
* [x] **Policy properties**:
* [x] SELECT: Public (mọi người đều xem được bài published).
* [x] INSERT: Chỉ authenticated và role là Admin hoặc Agent.
* [x] UPDATE/DELETE: Chỉ Admin hoặc người có id trùng với `created_by`.


* [x] **Policy leads**:
* [x] INSERT: Public (khách điền form).
* [x] SELECT: Admin hoặc Agent có id trùng với `agent_id` của lead đó.

### 1.6. Chốt sổ Giai đoạn 1 (Documentation)

* [x] Viết tài liệu `docs/DATABASE_SCHEMA.md` giải thích cấu trúc bảng, kiểu dữ liệu JSONB và RLS Policies.
* [x] Tổng kết Database Schema, RLS và Triggers vào file `docs/PHASE_1_DBO.md`.


---

## 🎼 GIAI ĐOẠN 2: BUS - NHẠC TRƯỞNG LOGIC & XÂY DỰNG BACKEND NODE.JS (RAILWAY)

*(Tác vụ: Code tại thư mục backend/)*

### 2.1. Khởi tạo & Cấu hình (Config)

* [ ] Chạy `npm init -y` tại thư mục `backend/`.
* [ ] Cài đặt package: `express`, `cors`, `dotenv`, `@supabase/supabase-js`.
* [ ] Tạo file `backend/.env`. Điền API keys của Supabase, Cloudinary, Resend.
* [ ] Tạo `backend/src/server.ts`: Khởi tạo Express app, set up CORS.
* [ ] Tạo `backend/src/config/supabase.ts`: Khởi tạo Supabase client.
* [ ] Tạo các file config cho `cloudinary.ts` và `resend.ts`.

### 2.2. Xây dựng Middleware Phân quyền (RBAC) & Authentication / Authorization

* [ ] Tạo `backend/src/middlewares/auth.middleware.ts`.
* [ ] Viết hàm `verifyToken`: Lấy Bearer token, giải mã với Supabase Auth.
* [ ] Tạo `backend/src/middlewares/role.middleware.ts`.
* [ ] Viết hàm `requireAdmin`: Kiểm tra `req.user.role === 'admin'`.
* [ ] Viết hàm `requireAgentOrAdmin`: Kiểm tra `req.user.role === 'agent' || 'admin'`.
* [ ] Xử lý JWT: Giải mã và kiểm tra tính hợp lệ của token.
* [ ] Permission Check: Viết hàm `canEditProperty(user, propertyId)` để kiểm tra quyền sở hữu trước khi thực hiện logic BUS.
* [ ] **[LỜI KHUYÊN] Xử lý lỗi tập trung (Global Error Handling)**: Tại lớp BUS, hãy tạo một middleware chuyên biệt để bắt tất cả các lỗi và trả về JSON chuẩn (ví dụ: `{ error: "Message", code: 400 }`). Điều này giúp GUI không bị "crash" khi gặp lỗi bất ngờ.
> *Ghi chú: Đăng ký `error.middleware.ts` ở dòng cuối cùng của file `server.ts` (sau tất cả các route) để bắt mọi lỗi phát sinh.*



### 2.3. Xây dựng Tầng Services & Utils Bổ sung

* [ ] Tạo `backend/src/services/translation.service.ts`: Hàm gọi Google/Libre API.
* [ ] Tạo `backend/src/services/notification.service.ts`: Hàm gọi Resend gửi mail.
* [ ] Tạo `backend/src/services/upload.service.ts`: Hàm upload ảnh lên Cloudinary.
* [ ] Tạo `backend/src/services/censor.service.ts`: Thuật toán Regex dò tìm từ khóa cấm trong nội dung diễn đàn.
* [ ] **[BỔ SUNG]** Tạo `backend/src/services/log.service.ts`: Lưu vết mọi thao tác của Admin/Agent để quản lý lịch sử hệ thống.
* [ ] **[BỔ SUNG]** Tạo `backend/src/utils/slug.util.ts`: Hàm chuyển đổi Tiếng Việt có dấu thành slug không dấu cho URL.

### 2.4. Xây dựng Controllers, Logic Core (Nhạc trưởng) & Chi tiết CRUD tương tác

* [ ] Tạo `backend/src/controllers/property.controller.ts`.
* [ ] Tạo `backend/src/controllers/project.controller.ts`.
* [ ] Hàm `createProperty`: Nhận JSON data, parse phần dữ liệu linh hoạt nhét vào cột `attributes` (JSONB) trước khi đẩy xuống Supabase.
* [ ] Hàm `getProperties`: Thêm điều kiện lọc `agent_id` nếu người request là Agent.
* [ ] Tạo `backend/src/controllers/forum.controller.ts`.
* [ ] Hàm `createPost`: Gọi `censor.service.ts` trước. Nếu pass, set `status='pending'`, insert xuống Supabase.
* [ ] Tạo `backend/src/controllers/lead.controller.ts`.
* [ ] Hàm `submitLead`: Insert DB -> Lấy email Agent/Admin phụ trách -> Gọi `notification.service.ts` bắn email.
* [ ] **Create Property**:
* [ ] Kiểm tra file upload có đúng định dạng (jpg, png, mp4).
* [ ] Tự động tạo slug từ tên dự án (sử dụng `slug.util.ts`).
* [ ] Gọi API dịch thuật ngay sau khi lưu bản gốc.


* [ ] **Read (Public)**: Cache dữ liệu các dự án hot để giảm tải cho Supabase.
* [ ] **Update**: Gọi `log.service.ts` để lưu lại lịch sử chỉnh sửa - ai đã sửa cái gì vào lúc nào.
* [ ] **Delete**: Áp dụng "Soft Delete" (chỉ đánh dấu `is_deleted = true`) thay vì xóa vĩnh viễn để tránh mất dữ liệu nhầm.

### 2.5. Logic Diễn đàn & Cộng đồng (Advanced)

* [ ] Rate Limiting: Chặn Member spam (Ví dụ: 1 phút chỉ được đăng 1 bình luận).
* [ ] Auto-Censor Service: Lọc từ thô tục. Chặn chèn link website đối thủ (Regex check).
* [ ] Notification Logic: Admin duyệt bài -> Gửi mail thông báo cho Member bài đã lên sóng. Có khách điền form -> Bắn thông báo Real-time qua Socket.io hoặc Push Notification.

### 2.6. Đa ngôn ngữ (Translation Workflow)

* [ ] Tích hợp cơ chế "Fallback": Nếu bản dịch tiếng Anh chưa có, tự động hiển thị tiếng Việt thay vì để trống.
* [ ] API Endpoint riêng cho việc Admin "Approve" bản dịch máy.

### 2.7. Xây dựng Routes (Định tuyến API)

* [ ] Tạo `backend/src/routes/property.routes.ts`: Map endpoint với Controller, gắn middleware auth/role vào.
* [ ] Tạo `backend/src/routes/project.routes.ts`.
* [ ] Tạo `backend/src/routes/index.ts`: Gom toàn bộ routes vào tiền tố `/api`. Map vào `server.ts`.

### 2.8. Chốt sổ Giai đoạn 2 (Documentation)
* [ ] Tổng kết danh sách API, luồng Middlewares và Error Handling vào file `docs/PHASE_2_BUS.md`.
* [ ] Cập nhật tài liệu `docs/API_REFERENCE.md` cho các API đã hoàn thiện.

---

## 💻 GIAI ĐOẠN 3: LỚP GUI - CORE, TRẢI NGHIỆM NGƯỜI DÙNG & DASHBOARD QUẢN TRỊ (ANGULAR)

*(Tác vụ: Code tại thư mục frontend/)*

### 3.1. Thiết lập Core (Khung xương Angular)

* [ ] Chạy `ng new frontend`. Xóa các file rác.
* [ ] Khởi tạo thư mục `frontend/src/app/core/`.
* [ ] **[BỔ SUNG]** Tạo `frontend/src/app/core/models/`: Định nghĩa các Interface toàn cục (`User.ts`, `Property.ts`, `Lead.ts`, `ThemeConfig.ts`).
* [ ] Tạo `core/services/api.service.ts`: Viết các hàm HttpClient (get, post, put, delete) gọi lên BUS.
* [ ] Tạo `core/interceptors/auth.interceptor.ts`: Tự động nhét JWT token vào Header của mọi request. Cấu hình vào `app.module.ts`.
* [ ] Tạo `core/guards/admin.guard.ts` và `agent.guard.ts`: Bảo vệ các route nhạy cảm.

### 3.2. Cấu trúc Module Admin Dashboard / Dashboard Quản trị (Admin & Agent)

* [ ] Tạo `frontend/src/app/admin/admin.module.ts` và `admin-routing.module.ts`.
* [ ] **State Management (NgRx/Signals)**: Quản lý trạng thái dữ liệu mượt mà, không load lại trang.
* [ ] Tạo `admin/layout/sidebar.component.ts`: Viết logic HTML dùng `*ngIf`: Nếu role là Agent, ẩn tab "Cấu hình Theme", "Duyệt Diễn Đàn".
* [ ] Tạo `admin/pages/properties-manage/`: Dựng Reactive Form. Viết logic form động: Khi select `type = apartment`, hiện input "Phòng ngủ". Khi `type = townhouse`, hiện input "Mặt tiền".
* [ ] **Property Editor**: Tích hợp trình soạn thảo văn bản (Rich Text Editor) cho phần mô tả. Chức năng "Preview": Xem thử giao diện Theme sẽ trông như thế nào trước khi đăng.
* [ ] Tạo `admin/pages/forum-approval/`: Bảng hiển thị danh sách bài pending. Nút "Approve" gọi API PUT sang BUS.
* [ ] Tạo `admin/pages/translations-manage/`: Layout chia 2 cột để đối chiếu bản dịch gốc - bản dịch máy.
* [ ] **Lead Management**: Nút "Gọi ngay" (Mở ứng dụng gọi điện trên phone). Ghi chú (Internal Notes) cho mỗi khách hàng để Admin/Agent theo dõi tiến độ tư vấn.
* [ ] **Agent Portal (Bị hạn chế)**: Chỉ thấy biểu đồ doanh số/leads của cá nhân. Không thấy menu "Quản lý User" hoặc "Cấu hình hệ thống".

### 3.3. Shared Components & Validators (Bổ sung)

* [ ] **[BỔ SUNG] Skeleton Loader**: Tạo `frontend/src/app/shared/components/skeleton-loader/` để tối ưu UX.
> *Lưu ý: Tạo các mẫu skeleton riêng cho từng theme để người dùng cảm nhận được layout ngay khi đang load.*


* [ ] **[BỔ SUNG] Validators**: Tạo các hàm kiểm tra dữ liệu form (Số điện thoại Việt Nam, định dạng email, mật khẩu mạnh...).

### 3.4. Diễn đàn (Cộng đồng)

* [ ] Giao diện đăng bài hỗ trợ upload ảnh (qua Cloudinary).
* [ ] Hệ thống Reaction (Like/Tim) cho bài viết.
* [ ] Nút "Báo cáo" (Report) kèm lý do (Spam, nội dung xấu...).

### 3.5. Chốt sổ Giai đoạn 3 (Documentation)
* [ ] Tài liệu hóa luồng hoạt động của Admin/Agent Dashboard và Phân quyền UI vào file `docs/PHASE_3_GUI_ADMIN.md`.
* [ ] Cập nhật tài liệu hướng dẫn sử dụng cơ bản `docs/USER_MANUAL.md` cho Admin và Agent.

---

## 🎨 GIAI ĐOẠN 4: LỚP GUI - THEME ENGINE KHÁCH HÀNG (MŨI NHỌN UI/UX)

*(Tác vụ: Code tại thư mục frontend/src/app/themes/)*

### 4.1. Cơ chế Routing Thông minh (Theme Resolver) & Theme Engine

* [ ] Tạo `themes/theme.resolver.ts`: Gọi API xuống BUS lấy `theme_id` của dự án từ URL.
* [ ] Tại `app-routing.module.ts`: Viết logic Lazy Load. Nếu resolver trả về luxury, load `LuxuryModule`. Nếu eco-green, load `EcoGreenModule`.
* [ ] **Dynamic Component Loader**: Cơ chế load module theme dựa trên config từ database.
* [ ] **Performance Check**: Lazy loading cho từng theme. **Image Optimization**: Tự động dùng ảnh kích thước nhỏ hơn cho Mobile.
* [ ] **SEO Meta Tags**: Tự động thay đổi Title, Description, Social Image theo dự án để tối ưu tìm kiếm.
* [ ] **[LỜI KHUYÊN] Tối ưu SEO (Sitemap & Robots)**: Tạo script tự động tạo file `sitemap.xml` mỗi khi có dự án mới.
> *Kỹ thuật: `scripts/sitemap-generator.ts` nên chạy sau mỗi lần `property.controller` thực hiện thành công `create` hoặc `delete`.*



### 4.2. Triển khai Theme 1: Luxury (Căn hộ cao cấp)

* [ ] Tạo `themes/luxury/luxury.module.ts`.
* [ ] Cấu hình `luxury.component.scss`: Định nghĩa biến CSS riêng (màu đen/vàng đồng, font Serif).
* [ ] Xây dựng `themes/luxury/components/hero-banner.component.ts`: Code animation mượt mà, ảnh tràn viền.

### 4.3. Triển khai Theme 2: Minimalist (Nhà phố)

* [ ] Tạo `themes/minimalist/minimalist.module.ts`.
* [ ] Cấu hình `minimalist.component.scss`: Card UI vuông vức, nền trắng/xám nhẹ, font Sans-serif.
* [ ] Xây dựng layout nhấn mạnh vào thông số diện tích và bản đồ.

### 4.4. Triển khai Theme 3: Eco-Green (Khu sinh thái)

* [ ] Tạo `themes/eco-green/eco-green.module.ts`.
* [ ] Cấu hình `eco-green.component.scss`: Màu xanh lá chủ đạo, các góc bo tròn (border-radius lớn).
* [ ] Xây dựng layout nhấn mạnh hình ảnh tiện ích, không gian trống (whitespace).

### 4.5. Tích hợp Đa ngôn ngữ (Client-side tĩnh)

* [ ] Tạo các file JSON tại `frontend/src/assets/i18n/` (`vi.json`, `en.json`, `zh.json`).
* [ ] Cài đặt `@ngx-translate/core`. Áp dụng pipe `{{ 'HOME.TITLE' | translate }}` vào cả 3 themes.

### 4.6. Chốt sổ Giai đoạn 4 (Documentation)
* [ ] Ghi chú lại logic hoạt động của Multi-Theme Engine, Lazy Loading, và cấu hình Resolver vào file `docs/PHASE_4_GUI_THEMES.md`.
* [ ] Hoàn thiện `docs/THEME_DEVELOPMENT_GUIDE.md` hướng dẫn cách tạo theme mới.

---

## ✅ GIAI ĐOẠN 5: CHECKLIST TỔNG KIỂM TRA (QA), KIỂM THỬ VÀ DEPLOY

### 5.1. Kiểm tra quyền (Security Check)

* [ ] Agent không thể vào URL `/admin/settings` bằng cách gõ tay (Guard chặn).
* [ ] Agent A không thể sửa bài của Agent B qua API (BUS chặn).
* [ ] Khách vãng lai không thể xem thông tin Leads của người khác.

### 5.2. Testing chéo (Cross-check)

* [ ] **Test DBO RLS**: Dùng token Agent gọi API xóa project -> Chắc chắn nhận HTTP 403.
* [ ] **Test BUS Lọc Từ**: Đăng bài chứa từ khóa cấm -> Chắc chắn báo lỗi "Nội dung vi phạm".
* [ ] **Test GUI Theme Engine**: Đổi `theme_id` Dự án A trên Admin -> Giao diện khách phải đổi 100%.

### 5.3. Kiểm tra Đa ngôn ngữ

* [ ] Các thông báo lỗi (Error messages) đã được dịch.
* [ ] Kiểm tra URL (slug) khi đổi ngôn ngữ.

### 5.4. Kiểm tra Tương tác & Trải nghiệm

* [ ] Form liên hệ thông báo thành công rõ ràng.
* [ ] Hiển thị **Skeleton Screen** khi mạng yếu.
* [ ] Kiểm tra hiển thị Mobile (iPhone/Android) không lỗi menu, không tràn khung.

### 5.5. Go-Live

* [ ] **Backend**: Push code lên Github -> Railway. Kiểm tra log `server.ts`.
* [ ] Cập nhật `environment.prod.ts` trỏ về URL Railway.
* [ ] **Frontend**: Push code lên Github -> Vercel. Chạy build.
* [ ] Truy cập tên miền chính thức và hoàn thành dự án!

### 5.6. Chốt sổ Giai đoạn 5 (Documentation)
* [ ] Hoàn thiện tài liệu nghiệm thu (Checklist Testing, Config Vercel/Railway) vào file `docs/PHASE_5_DEPLOY_QA.md`.
* [ ] Cập nhật hướng dẫn triển khai lên Vercel và Railway vào `docs/DEPLOYMENT.md`.
* [ ] Rà soát, duyệt lại và đóng băng tất cả các tài liệu hệ thống trước khi Go-live.