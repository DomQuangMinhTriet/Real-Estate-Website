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
* [x] **[BỔ SUNG]** Tạo file `database/08_setup_logs.sql` để tạo bảng `system_logs` và cấu hình RLS chỉ Admin xem được.
* [x] **[BỔ SUNG]** Tạo file `database/09_setup_blogs.sql` để tạo bảng `blogs` (CMS Marketing) với cấu trúc JSONB cho Layout Builder.

### 1.6. Chốt sổ Giai đoạn 1 (Documentation)

* [x] Viết tài liệu `docs/DATABASE_SCHEMA.md` giải thích cấu trúc bảng, kiểu dữ liệu JSONB và RLS Policies.
* [x] Tổng kết Database Schema, RLS và Triggers vào file `docs/PHASE_1_DBO.md`.


---

## 🎼 GIAI ĐOẠN 2: BUS - NHẠC TRƯỞNG LOGIC & XÂY DỰNG BACKEND NODE.JS (RAILWAY)

*(Tác vụ: Code tại thư mục backend/)*

### 2.1. Khởi tạo & Cấu hình (Config)

* [x] Chạy `npm init -y` tại thư mục `backend/`.
* [x] Cài đặt package: `express`, `cors`, `dotenv`, `@supabase/supabase-js`.
* [x] Tạo file `backend/.env`. Điền API keys của Supabase, Cloudinary, Resend.
* [x] Tạo `backend/src/server.ts`: Khởi tạo Express app, set up CORS.
* [x] Tạo `backend/src/config/supabase.ts`: Khởi tạo Supabase client.
* [x] Tạo các file config cho `cloudinary.ts` và `resend.ts`.

### 2.2. Xây dựng Middleware Phân quyền (RBAC) & Authentication / Authorization

* [x] Tạo `backend/src/middlewares/auth.middleware.ts`.
* [x] Viết hàm `verifyToken`: Lấy Bearer token, giải mã với Supabase Auth.
* [x] Tạo `backend/src/middlewares/role.middleware.ts`.
* [x] Viết hàm `requireAdmin`: Kiểm tra `req.user.role === 'admin'`.
* [x] Viết hàm `requireAgentOrAdmin`: Kiểm tra `req.user.role === 'agent' || 'admin'`.
* [x] Xử lý JWT: Giải mã và kiểm tra tính hợp lệ của token.
* [x] Permission Check: Viết hàm `canEditProperty(user, propertyId)` để kiểm tra quyền sở hữu trước khi thực hiện logic BUS.
* [x] **[LỜI KHUYÊN] Xử lý lỗi tập trung (Global Error Handling)**: Tại lớp BUS, hãy tạo một middleware chuyên biệt để bắt tất cả các lỗi và trả về JSON chuẩn (ví dụ: `{ error: "Message", code: 400 }`). Điều này giúp GUI không bị "crash" khi gặp lỗi bất ngờ.
> *Ghi chú: Đăng ký `error.middleware.ts` ở dòng cuối cùng của file `server.ts` (sau tất cả các route) để bắt mọi lỗi phát sinh.*



### 2.3. Xây dựng Tầng Services & Utils Bổ sung

* [x] Tạo `backend/src/services/translation.service.ts`: Hàm gọi Google/Libre API.
* [x] Tạo `backend/src/services/notification.service.ts`: Hàm gọi Resend gửi mail.
* [x] Tạo `backend/src/services/upload.service.ts`: Hàm upload ảnh lên Cloudinary.
* [x] Tạo `backend/src/services/censor.service.ts`: Thuật toán Regex dò tìm từ khóa cấm trong nội dung diễn đàn.
* [x] **[BỔ SUNG]** Tạo `backend/src/services/log.service.ts`: Lưu vết mọi thao tác của Admin/Agent để quản lý lịch sử hệ thống.
* [x] **[BỔ SUNG]** Tạo `backend/src/utils/slug.util.ts`: Hàm chuyển đổi Tiếng Việt có dấu thành slug không dấu cho URL.

### 2.4. Xây dựng Controllers, Logic Core (Nhạc trưởng) & Chi tiết CRUD tương tác

* [x] Tạo `backend/src/controllers/property.controller.ts`.
* [x] Tạo `backend/src/controllers/project.controller.ts`.
* [x] Hàm `createProperty`: Nhận JSON data, parse phần dữ liệu linh hoạt nhét vào cột `attributes` (JSONB) trước khi đẩy xuống Supabase.
* [x] Hàm `getProperties`: Thêm điều kiện lọc `agent_id` nếu người request là Agent.
* [x] Tạo `backend/src/controllers/forum.controller.ts`.
* [x] Hàm `createPost`: Gọi `censor.service.ts` trước. Nếu pass, set `status='pending'`, insert xuống Supabase.
* [x] Tạo `backend/src/controllers/lead.controller.ts`.
* [x] Hàm `submitLead`: Insert DB -> Lấy email Agent/Admin phụ trách -> Gọi `notification.service.ts` bắn email.
* [x] **Create Property**:
* [x] Kiểm tra file upload có đúng định dạng (jpg, png, mp4).
* [x] Tự động tạo slug từ tên dự án (sử dụng `slug.util.ts`).
* [x] Gọi API dịch thuật ngay sau khi lưu bản gốc.


* [x] **Read (Public)**: Cache dữ liệu các dự án hot để giảm tải cho Supabase.
* [x] **Update**: Gọi `log.service.ts` để lưu lại lịch sử chỉnh sửa - ai đã sửa cái gì vào lúc nào.
* [x] **Delete**: Áp dụng "Soft Delete" (chỉ đánh dấu `is_deleted = true`) thay vì xóa vĩnh viễn để tránh mất dữ liệu nhầm.

### 2.5. Logic Diễn đàn & Cộng đồng (Advanced)

* [x] Rate Limiting: Chặn Member spam (Ví dụ: 1 phút chỉ được đăng 1 bình luận).
* [x] Auto-Censor Service: Lọc từ thô tục. Chặn chèn link website đối thủ (Regex check).
* [x] Notification Logic: Admin duyệt bài -> Gửi mail thông báo cho Member bài đã lên sóng. Có khách điền form -> Bắn thông báo Real-time qua Socket.io hoặc Push Notification.

### 2.6. Đa ngôn ngữ (Translation Workflow)

* [x] Tích hợp cơ chế "Fallback": Nếu bản dịch tiếng Anh chưa có, tự động hiển thị tiếng Việt thay vì để trống.
* [x] API Endpoint riêng cho việc Admin "Approve" bản dịch máy.

### 2.7. Xây dựng Routes (Định tuyến API)

* [x] Tạo `backend/src/routes/property.routes.ts`: Map endpoint với Controller, gắn middleware auth/role vào.
* [x] **[BỔ SUNG]** API Lấy danh mục `categories` cho thuộc tính và lưu trữ mảng hình ảnh vào `property_media`.
* [x] Tạo `backend/src/routes/auth.routes.ts`: API Đăng ký, Đăng nhập, Quên mật khẩu và Đăng xuất.
* [x] Tạo `backend/src/routes/project.routes.ts`: Phân quyền Admin quản lý.
* [x] Tạo `backend/src/routes/lead.routes.ts`: Public API cho khách hàng vãng lai gửi yêu cầu.
* [x] **[BỔ SUNG]** API `GET /leads` và `PUT /leads/:id/status` cho Admin/Agent Dashboard.
* [x] **[BỔ SUNG]** API `POST /upload` với Multer lưu ảnh/video lên Cloudinary.
* [x] **[BỔ SUNG]** API `GET /profiles/me` và `PUT /profiles/me` quản lý hồ sơ Agent/Member.
* [x] **[BỔ SUNG]** API `GET /logs` giúp Admin kiểm soát lịch sử thao tác hệ thống.
* [x] **[BỔ SUNG]** Tạo `backend/src/controllers/blog.controller.ts` và `backend/src/routes/blog.routes.ts`: Quản lý bài viết Blog (Block-based).
* [x] Tạo `backend/src/routes/forum.routes.ts`: Đăng bài (VerifyToken) và Xem danh sách bài.
* [x] Tạo `backend/src/routes/index.ts`: Gom toàn bộ routes vào tiền tố `/api`. Map vào `server.ts`.

### 2.8. Chốt sổ Giai đoạn 2 (Documentation)
* [x] Tổng kết danh sách API, luồng Middlewares và Error Handling vào file `docs/PHASE_2_BUS.md`.
* [x] Cập nhật tài liệu `docs/API_REFERENCE.md` cho các API đã hoàn thiện.

---

## 💻 GIAI ĐOẠN 3: LỚP GUI - CORE, TRẢI NGHIỆM NGƯỜI DÙNG & DASHBOARD QUẢN TRỊ (ANGULAR)

*(Tác vụ: Code tại thư mục frontend/)*

### 3.1. Thiết lập Core (Khung xương Angular)

* [x] Chạy `ng new frontend`. Xóa các file rác.
* [x] Khởi tạo thư mục `frontend/src/app/core/`.
* [x] **[BỔ SUNG]** Tạo `frontend/src/app/core/models/`: Định nghĩa các Interface toàn cục (`User.ts`, `Property.ts`, `Lead.ts`, `ThemeConfig.ts`).
* [x] Tạo `core/services/api.service.ts`: Viết các hàm HttpClient (get, post, put, delete) gọi lên BUS.
* [x] **[BỔ SUNG]** Tạo `core/services/upload.service.ts`: Xử lý bọc Form-Data để gọi API `POST /upload`.
* [x] **[BỔ SUNG]** Tạo `core/services/socket.service.ts`: Khởi tạo kết nối `Socket.io` client để lắng nghe các sự kiện real-time (ví dụ: `new_lead`).
* [x] Tạo `core/interceptors/auth.interceptor.ts`: Tự động nhét JWT token vào Header của mọi request. Cấu hình vào `app.module.ts`.
* [x] Tạo `core/guards/admin.guard.ts` và `agent.guard.ts`: Bảo vệ các route nhạy cảm.

### 3.2. Cấu trúc Module Admin Dashboard / Dashboard Quản trị (Admin & Agent)

* [x] Tạo `frontend/src/app/admin/admin.module.ts` và `admin-routing.module.ts`.
* [x] **State Management (NgRx/Signals)**: Tích hợp định tuyến Lazy Loading.
* [x] Tạo `admin/layout/sidebar.component.ts` (và header): Viết logic HTML dùng `*ngIf`: Nếu role là Agent, ẩn tab "Cấu hình Theme", "Duyệt Diễn Đàn".
* [x] **Xây dựng Authentication Module (`auth/`)**:
  * [x] Tạo `AuthService`: Viết các hàm gọi API (`login`, `register`, `logout`, `forgotPassword`, `resetPassword`) và lưu/xóa JWT Token ở LocalStorage.
  * [x] Dựng `login.component`: Reactive Form đăng nhập. Xử lý lưu `access_token` và redirect vào Dashboard.
  * [x] Dựng `register.component`: Reactive Form đăng ký (Tích hợp Validator check khớp Mật khẩu). Thông báo người dùng check email.
  * [x] Dựng `forgot-password.component`: Form nhập email gọi API `/auth/forgot-password`.
  * [x] Dựng `reset-password.component`: Bắt token từ URL (qua `ActivatedRoute`), form nhập mật khẩu mới gọi API `/auth/reset-password`.
  * [x] Xử lý Đăng xuất (Logout): Nút trên Header sidebar, gọi API `/auth/logout`, clear token và đẩy về trang đăng nhập.
* [x] **[BỔ SUNG]** Tạo `admin/pages/account-settings/`: Trang cá nhân cho phép Admin/Agent/Member đổi Avatar, Tên, Số điện thoại (`PUT /profiles/me`). 
* [x] **[BỔ SUNG]** Tạo form "Đăng ký làm Môi giới" trong Account Settings để Member gọi API `POST /leads/agent-requests`.
* [x] **[BỔ SUNG]** Tạo `admin/pages/dashboard-stats/`: Dựng biểu đồ tổng quan dựa vào API `GET /stats`. Lắng nghe `Socket.io` để nhảy số Leads. *(Lưu ý UI: Agent chỉ xem được thống kê cá nhân, Admin xem toàn hệ thống).*
* [x] Tạo `admin/pages/properties-manage/`: Dựng Reactive Form. 
  * **Quản lý BĐS**: Bảng danh sách phân trang/tìm kiếm (`GET /properties`). Tích hợp Thêm mới (`POST /properties`), Cập nhật (`PUT /properties/:id`) và Xóa mềm (`DELETE /properties/:id`).
  * Logic form động (JSONB): Khi select loại hình Căn hộ, hiện input "Phòng ngủ", Nhà phố hiện "Mặt tiền".
  * **[x] Media & Upload**: Giao diện kéo thả file gọi API `POST /upload`, nhận Cloudinary URL lưu vào DB. Cho phép xóa ảnh và đặt làm Thumbnail.
* [x] Tạo `admin/pages/categories-projects-manage/`: Giao diện CRUD quản lý Danh mục BĐS (`/properties/categories`) và Dự án (`GET`, `POST`, `PUT`, `DELETE /projects`).
* [x] Tạo `admin/pages/users-manage/`: Giao diện Admin quản lý người dùng, thay đổi Role (`PUT /profiles/:id/role`).
* [x] Tạo `admin/pages/agent-requests/`: Hiển thị danh sách đăng ký môi giới (`GET /leads/agent-requests`). Nút Duyệt/Từ chối (`PUT /leads/agent-requests/:id/status`).
* [x] Tạo `admin/pages/forum-approval/`: 
  * Tab "Bài viết chờ duyệt": Gọi API `GET /forum/pending`, nút "Approve" (`PUT /forum/:id/approve`) và "Xóa bài" (`DELETE /forum/:id`).
  * Tab "Báo cáo vi phạm": Gọi API `GET /forum/reports/pending` và xử lý (`PUT /forum/reports/:reportId/resolve`).
  * Tab "Quản lý Bình luận": Nút xóa bình luận rác gọi API `DELETE /forum/comments/:commentId`.
* [x] Tạo `admin/pages/translations-manage/`: 
  * Gọi API `GET /translations/pending` để lấy danh sách bản dịch máy đang chờ duyệt.
  * Layout chia 2 cột để đối chiếu bản dịch gốc - bản dịch máy.
  * Nút "Duyệt nhanh" (`PUT /translations/:id/approve`) và form Lưu chỉnh sửa nếu máy dịch sai (`PUT /translations/:id`).
* [x] **Lead Management**: Gọi API `GET /leads`. Thêm tính năng cập nhật `status` và `notes` (ghi chú nội bộ) qua API `PUT /leads/:id`.
* [x] **[BỔ SUNG] Agent Portal (Hạn chế quyền)**: Ẩn các menu "Quản lý User", "Duyệt Diễn Đàn", "Nhật ký hệ thống", "Dịch thuật" trên Sidebar nếu role là `agent`.
* [x] **[BỔ SUNG]** Tạo `admin/pages/system-logs/`: Hiển thị lịch sử hoạt động hệ thống (`GET /logs`) dành riêng cho Admin (Bảo vệ bởi AdminGuard).
* [x] **[BỔ SUNG]** Tạo `admin/pages/blog-manage/`: 
  * `blog-manage.component`: Danh sách Blog (Admin duyệt, Agent quản lý bài viết của mình).
  * `blog-editor.component`: Trình soạn thảo Blog dạng kéo thả Component (Layout Builder) lưu vào JSONB, hỗ trợ Live Preview.

### 3.3. Shared Components & Validators (Bổ sung)

* [x] **[BỔ SUNG] Skeleton Loader**: Tạo `frontend/src/app/shared/components/skeleton-loader/` để tối ưu UX.
> *Lưu ý: Tạo các mẫu skeleton riêng cho từng theme để người dùng cảm nhận được layout ngay khi đang load.*

* [x] **[BỔ SUNG] Validators**: Tạo các hàm kiểm tra dữ liệu form (Số điện thoại Việt Nam, định dạng email, mật khẩu mạnh...).

### 3.4. Diễn đàn (Cộng đồng)

* [x] **Trang Danh sách Bài viết**: Gọi API `GET /forum` hiển thị luồng thảo luận của cộng đồng.
* [x] **Trang Chi tiết Bài viết & Bình luận**: Gọi API `GET /forum/:id` và `GET /forum/:postId/comments`.
* [x] Giao diện đăng bài (`POST /forum`): Giới hạn Rate Limit và hiển thị thông báo "Bài viết đang chờ duyệt".
* [x] Tính năng Bình luận (`POST /forum/:postId/comments`), Reaction (`POST /forum/:postId/react`) và Báo cáo vi phạm (`POST /forum/:postId/report`).

### 3.5. Chốt sổ Giai đoạn 3 (Documentation)
* [x] Tài liệu hóa luồng hoạt động của Admin/Agent Dashboard và Phân quyền UI vào file `docs/PHASE_3_GUI_ADMIN.md`.
* [x] Cập nhật tài liệu hướng dẫn sử dụng cơ bản `docs/USER_MANUAL.md` cho Admin và Agent.

---

## 🎨 GIAI ĐOẠN 4: LỚP GUI - THEME ENGINE KHÁCH HÀNG (MŨI NHỌN UI/UX)

*(Tác vụ: Code tại thư mục frontend/src/app/themes/)*

### 4.1. Cơ chế Routing Thông minh (Theme Resolver) & Theme Engine

* [ ] Tạo `themes/theme.resolver.ts`: Gọi API xuống BUS lấy `theme_id` của dự án từ URL.
* [ ] Tại `app-routing.module.ts`: Viết logic Lazy Load. Nếu resolver trả về luxury, load `LuxuryModule`. Nếu eco-green, load `EcoGreenModule`.
* [ ] **Dynamic Component Loader**: Cơ chế load module theme dựa trên config từ database.
* [ ] **Performance Check**: Lazy loading cho từng theme. **Image Optimization**: Tự động dùng ảnh kích thước nhỏ hơn cho Mobile.
* [ ] **SEO Meta Tags**: Tự động thay đổi Title, Description, Social Image theo dự án để tối ưu tìm kiếm.
* [ ] **[BỔ SUNG] Trang Chi tiết BĐS**: Gọi API `GET /properties/:slug` hiển thị đầy đủ thông tin, `attributes` JSONB và slider ảnh từ `property_media` cho khách hàng.
* [x] **[LỜI KHUYÊN] Tối ưu SEO (Sitemap & Robots)**: Xây dựng API tự động render `sitemap.xml` động (On-the-fly) để luôn cập nhật URL BĐS mới nhất cho Google Bot mà không cần lưu file cứng.
> *Đã hoàn thiện tại Giai đoạn 2 bằng API `GET /api/seo/sitemap.xml` chuẩn kiến trúc Cloud.*



### 4.2. Triển khai Theme 1: Luxury (Căn hộ cao cấp)

* [ ] Tạo `themes/luxury/luxury.module.ts`.
* [ ] Cấu hình `luxury.component.scss`: Định nghĩa biến CSS riêng (màu đen/vàng đồng, font Serif).
* [ ] Xây dựng `themes/luxury/components/hero-banner.component.ts`: Animation mượt, form đăng ký (`POST /leads`) thiết kế sang trọng.

### 4.3. Triển khai Theme 2: Minimalist (Nhà phố)

* [ ] Tạo `themes/minimalist/minimalist.module.ts`.
* [ ] Cấu hình `minimalist.component.scss`: Card UI vuông vức, nền trắng/xám nhẹ, font Sans-serif.
* [ ] Xây dựng layout nhấn mạnh vào thông số diện tích (`attributes` JSONB) và bản đồ.

### 4.4. Triển khai Theme 3: Eco-Green (Khu sinh thái)

* [ ] Tạo `themes/eco-green/eco-green.module.ts`.
* [ ] Cấu hình `eco-green.component.scss`: Màu xanh lá chủ đạo, các góc bo tròn (border-radius lớn).
* [ ] Xây dựng layout nhấn mạnh hình ảnh tiện ích mở rộng (`attributes` JSONB), không gian trống (whitespace).

### 4.5. Tích hợp Đa ngôn ngữ (Client-side tĩnh & API động)

* [ ] Tạo các file JSON tại `frontend/src/assets/i18n/` (`vi.json`, `en.json`, `zh.json`).
* [ ] Cài đặt `@ngx-translate/core`. Áp dụng pipe `{{ 'HOME.TITLE' | translate }}` vào cả 3 themes.
* [ ] **Tích hợp API dịch thuật:** Gọi API `GET /translations`. Xử lý logic **Fallback**: Nếu API trả về `fallback: true`, hiển thị text gốc (Tiếng Việt) kèm thông báo nhỏ (hoặc ẩn) thay vì bị lỗi mất chữ.

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