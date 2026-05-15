# 🚀 CHỐT SỔ GIAI ĐOẠN 2: LỚP BUS (Backend Node.js)

**Trạng thái:** Hoàn thành ✅

Tài liệu này tổng kết kiến trúc, luồng hoạt động và danh sách các tính năng đã được phát triển trong Giai đoạn 2 (Tầng BUS - Business Logic Layer).

## 1. Kiến trúc Hệ thống Backend
Backend được xây dựng bằng Node.js với Express framework, sử dụng TypeScript để đảm bảo an toàn kiểu dữ liệu và tổ chức code thành các modules rời rạc.

### 1.1. Luồng xử lý Request
Mọi request gửi tới API đều đi qua quy trình chuẩn:
1. **CORS & Body Parser:** Cho phép truy cập chéo tên miền, parse JSON payload.
2. **Rate Limiting:** (Chỉ áp dụng cho các route nhạy cảm như POST `/api/forum`) chặn spam 1 phút/1 request.
3. **Authentication (JWT):** Middleware `verifyToken` kiểm tra tính hợp lệ của token bằng `supabase.auth.getUser()`.
4. **Role-based Authorization:** Middleware `requireAdmin` hoặc `requireAgentOrAdmin` kiểm tra quyền của `req.user.role`.
5. **Controller Logic:** Nhạc trưởng xử lý logic nghiệp vụ, gọi các Service bổ trợ để thực thi.
6. **Error Handling:** Global Error Middleware (`error.middleware.ts`) bắt tất cả lỗi và trả về chuẩn JSON (`{ error, code }`).

### 1.2. Các Service Bổ trợ (Third-party Integrations)
* **Translation Service (`translation.service.ts`):** Tích hợp MyMemory API để dịch tự động nội dung BĐS sang Tiếng Anh. Có gắn Email để tăng limit 50,000 ký tự.
* **Notification Service (`notification.service.ts`):** Sử dụng Resend API để gửi email thông báo (Có khách hàng mới, Bài diễn đàn được duyệt).
* **Upload Service (`upload.service.ts`):** Xử lý đẩy file cục bộ lên Cloudinary để lấy Link URL.
* **Censor Service (`censor.service.ts`):** Bộ lọc từ khóa thô tục và phát hiện link spam chèn trái phép.
* **Log Service (`log.service.ts`):** Ghi nhận mọi thao tác CREATE/UPDATE/DELETE của Admin/Agent vào bảng `system_logs`.
* **Supabase Client Config:** Đã tích hợp thư viện `ws` để làm polyfill WebSocket cho Supabase Realtime (tương thích hoàn toàn với Node.js < 22) và vô hiệu hóa tính năng lưu trữ `persistSession` để tối ưu cho môi trường API Backend.

### 1.3. Real-time Socket.io
Server được tích hợp Socket.io, giúp truyền sự kiện `new_lead` tới tất cả các client đang online ngay khi có người điền form.

## 2. Điểm nhấn Kỹ thuật (Technical Highlights)

1. **Background Tasks:** Việc gọi API dịch thuật và gửi Email được đặt ngầm (Không `await` trực tiếp trong luồng chính hoặc dùng `setTimeout(..., 0)`) giúp API phản hồi tức thì cho người dùng.
2. **Cơ chế Fallback Đa ngôn ngữ:** API lấy bản dịch luôn kiểm tra cờ `is_approved`. Nếu bản dịch chưa sẵn sàng, hệ thống tự động trả về bản gốc tiếng Việt kèm cờ `fallback: true`.
3. **Soft Delete:** Thay vì `DELETE` SQL, API áp dụng cập nhật `is_deleted = true`, kết hợp với RLS ở Giai đoạn 1 giúp bảo toàn dữ liệu tránh xóa nhầm.
4. **Bảo mật & Anti-Spam:** Bộ lọc Regex chặn link website đối thủ. Express Rate Limit kết hợp với logic truy vấn DB để chặn Spam Báo cáo diễn đàn và Spam form yêu cầu Môi giới.
5. **Bảo vệ Bộ nhớ (Memory Leak Prevention):** API Upload được thiết kế `try/catch` lồng nhau đảm bảo file tạm (`tmp`) luôn bị xóa khỏi Server bằng `fs.unlink` kể cả khi đường truyền lên Cloudinary thất bại.
6. **SEO On-the-fly:** Kiến trúc sinh sitemap.xml động thông qua API giúp tương thích 100% với các nền tảng Serverless/Cloud (như Railway) mà không phụ thuộc ổ cứng tĩnh.

## 3. Danh sách Endpoints
*   **`/api/auth`**: Các API Authentication (Đăng ký, Đăng nhập, Đăng xuất, Quên mật khẩu).
*   **`/api/profiles`**: Quản lý thông tin hồ sơ cá nhân và Admin phân quyền User.
*   **`/api/projects`**: Quản lý thông tin Dự án và Theme giao diện.
*   **`/api/properties`**: Core API quản lý BĐS (chi tiết theo slug, `attributes` JSONB, media) và CRUD cấu hình Danh mục (Categories).
*   **`/api/leads`**: Thu thập thông tin khách hàng và hệ thống Dashboard cho Admin/Agent cập nhật trạng thái (`status`).
*   **`/api/forum`**: Hệ thống bài viết cộng đồng (Pending / Approved).
*   **`/api/translations`**: API phân phối ngôn ngữ động.
*   **`/api/upload`**: Tải file lên Cloudinary thông qua Multer.
*   **`/api/logs`**: API truy xuất lịch sử thao tác hệ thống (System Logs) dành riêng cho Admin.
*   **`/api/stats`**: Lấy số liệu thống kê tổng quan (Dashboard Analytics) cho Admin/Agent.
*   **`/api/seo`**: Trả về cấu trúc `sitemap.xml` tự động cập nhật URL.

*(Vui lòng tham khảo tài liệu `API_REFERENCE.md` để xem cấu trúc Request/Response chi tiết của từng endpoint).*