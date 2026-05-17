# 🏛️ BÁO CÁO KIẾN TRÚC HỆ THỐNG VÀ LUỒNG KỸ THUẬT TOÀN DIỆN (GIAI ĐOẠN 1 - 3)

Tài liệu này là bản phác họa chi tiết nhất về toàn bộ hệ thống Pro-RealEstate tính đến thời điểm hoàn thành Giai đoạn 3 (Admin & Agent Dashboard). Nó giải thích các quyết định kiến trúc, các bài toán kỹ thuật hóc búa đã được giải quyết và luồng nghiệp vụ xuyên suốt 3 tầng: **DBO (Database) - BUS (Backend) - GUI (Frontend)**.

---

## 1. TẦNG BẢO MẬT GỐC & CƠ SỞ DỮ LIỆU (DBO - Supabase)

Tầng DBO không chỉ dùng để lưu trữ, mà đóng vai trò như một **Bức tường lửa thứ nhất** bảo vệ hệ thống.

### 1.1. Sức mạnh của dữ liệu động (JSONB)
Thay vì phải sử dụng cấu trúc bảng (Table) cứng nhắc hoặc mô hình EAV (Entity-Attribute-Value) chậm chạp, hệ thống đã ứng dụng thành công **JSONB** của PostgreSQL vào các luồng cốt lõi:
*   **Bất động sản (`properties.attributes`):** Cho phép một Căn hộ lưu `{ "bedrooms": 3, "pool": true }` trong khi một Đất nền lưu `{ "direction": "Đông", "area": 100 }` trên cùng một cột mà không cần chạy lệnh `ALTER TABLE`.
*   **Form Yêu cầu (`agent_requests.request_data`):** Cho phép hệ thống thu thập bất kỳ câu hỏi nào từ khách hàng muốn ứng tuyển làm môi giới.

### 1.2. Row Level Security (RLS) & Xử lý Edge Cases
Tất cả các bảng đều bật RLS. Đặc biệt, chúng ta đã giải quyết một bài toán kinh điển của RLS: **Lỗi Tàng hình khi Soft Delete (Mã lỗi 42501)**.
*   **Vấn đề:** Nếu Policy chỉ cho phép xem `is_deleted = false`, khi Agent thực hiện cập nhật `is_deleted = true`, dòng dữ liệu bị biến mất khỏi tầm nhìn của chính họ ngay tại thời điểm Update, dẫn đến DB từ chối giao dịch để chống rò rỉ.
*   **Giải pháp:** Mở rộng Policy SELECT cho `properties` thành: Cho phép Public xem `is_deleted = false` **NHƯNG** cho phép `Admin` và `Tác giả (created_by)` được quyền xem **toàn bộ** (kể cả đã xóa). Nhờ đó thao tác Soft Delete diễn ra mượt mà và mở đường cho tính năng "Thùng rác" (Trash).

### 1.3. Tự động hóa Dữ liệu (Postgres Triggers)
Hệ thống sử dụng các Triggers để đảm bảo tính toàn vẹn:
*   Bắt sự kiện đăng ký từ `auth.users` để tự động tạo một dòng bên `public.profiles` với Role mặc định là `member`. Xử lý Safe-cast (tránh lỗi ép kiểu Null) nếu Meta-data không truyền đầy đủ.

---

## 2. TẦNG LOGIC NGHIỆP VỤ & NHẠC TRƯỞNG (BUS - Node.js Express)

Tầng BUS nhận nhiệm vụ điều phối, phân quyền, tích hợp dịch vụ và tối ưu hiệu năng.

### 2.1. Phân quyền nhiều lớp (RBAC)
*   Xác thực bằng JWT (từ Supabase). Giải mã ngay tại Middleware `verifyToken`.
*   Phân luồng API với `requireAdmin` và `requireAgentOrAdmin`.
*   Đặc biệt, xử lý **Public API linh hoạt**: Với API `GET /properties`, nếu không có Token, hệ thống trả về toàn bộ BĐS công khai. Nếu Request truyền cờ `?manage=true` và giải mã được Token của Agent, hệ thống tự động chèn thêm câu query `.or('agent_id.eq.ID,created_by.eq.ID')` để lọc chỉ hiển thị BĐS do Agent đó phụ trách.

### 2.2. Xử lý Background Tasks (Không chặn luồng chính)
*   **Đa ngôn ngữ ngầm (Auto-Translation):** API Tạo BĐS mới trả về kết quả `201 Created` ngay lập tức cho người dùng, trong khi đó một tiến trình ngầm (dùng `setTimeout`) sẽ âm thầm gọi MyMemory API để dịch dữ liệu sang Tiếng Anh và lưu vào bảng `translations`.
*   **Cơ chế Fallback Ngôn ngữ:** Khi Client gọi `GET /translations`, nếu bản dịch chưa duyệt hoặc bị lỗi, hệ thống tự động gom (merge) dữ liệu Tiếng Việt gốc và trả về kèm cờ `fallback: true`.

### 2.3. Quản trị Tài nguyên & Bảo vệ Hệ thống
*   **Upload Cloudinary:** Nhận file từ Multer, stream lên Cloudinary. Đảm bảo file trong thư mục `tmp/` nội bộ luôn được xóa bằng `fs.unlinkSync` qua khối `try/finally` để chống rò rỉ bộ nhớ (Memory Leak) cho Server.
*   **Chống Spam Form:** Rate limit chặn 1 phút/1 bài đăng. Hàm `censor.service.ts` chặn đứng các từ khóa thô tục hoặc Regex phát hiện link website đối thủ (ví dụ: bds-competitor.com).
*   **Custom SMTP (Resend):** Vượt qua giới hạn gửi 3 email/giờ của Supabase bằng cách cấu hình trực tiếp tài khoản Resend vào hệ thống, kết hợp đếm ngược ở Frontend.

---

## 3. TẦNG GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (GUI - Angular 17)

Hệ thống Dashboard được xây dựng bằng kiến trúc Standalone Components, tập trung tuyệt đối vào UX/UI và Performance.

### 3.1. Kỹ thuật Form Hiện đại (Nested Reactive Forms)
Để tương thích hoàn hảo với JSONB của Database, Angular Form được thiết kế lồng nhau (`this.fb.group({ attributes: this.fb.group({...}) })`).
*   **Lợi ích:** Gom nhóm toàn bộ dữ liệu như `bedrooms`, `area` thành 1 cục JSON duy nhất gửi xuống Backend. Backend chỉ việc hứng và nhét thẳng vào Database mà không tốn 1 dòng code map dữ liệu.

### 3.2. Quản lý Trạng thái & Đồng bộ UI (NgZone & RxJS)
*   **ChangeDetectorRef (`cdr.detectChanges`):** Giải quyết triệt để vấn đề "Loading xoay vô tận" khi Angular không kịp nhận diện phản hồi bất đồng bộ (Promise) từ Supabase SDK. Ép giao diện cập nhật ngay lập tức khi API báo thành công hoặc lỗi.
*   **Chống Spam Click bằng RxJS:** Component Quên mật khẩu ứng dụng `timer(1000, 1000).pipe(take(60))` để tạo đồng hồ đếm ngược 60s, disable nút submit tự động, và dọn dẹp bằng `unsubscribe` khi hủy Component (chống Memory Leak trên trình duyệt).

### 3.3. UX Thông minh (Drag-n-Drop & Skeleton)
*   **Skeleton Loading:** Áp dụng hiệu ứng khung xương tải trang thay thế cho vòng xoay loading cổ điển.
*   **Kéo thả Upload:** Xử lý sự kiện `dragover`, `drop` của HTML5 kết hợp gọi API tức thời. Ảnh upload xong hiển thị ngay trên lưới Grid kèm tùy chọn chọn ảnh bìa (Thumbnail).
*   **Giao diện Toggle:** Loại bỏ việc chuyển trang (routing) khi Tạo/Sửa BĐS. Sử dụng Toggle Form (Ẩn list, hiện form) giữ cho ứng dụng nhẹ và mượt mà như một SPA thực thụ.

---

## 4. CÁC LUỒNG NGHIỆP VỤ XUYÊN SUỐT (END-TO-END WORKFLOWS)

### 4.1. Luồng Thu thập Khách hàng (CRM Leads Flow)
1.  **GUI:** Khách vãng lai xem BĐS, điền Form Tư vấn.
2.  **BUS:** Nhận dữ liệu, lưu vào `leads`. Phát sự kiện Real-time `new_lead` qua Socket.io. Trích xuất Email của Agent phụ trách và gọi Resend API gửi Email báo khách mới.
3.  **GUI (Dashboard):** Agent truy cập Dashboard, dữ liệu đã được lọc bằng `manage=true`. Agent bấm chuyển Status (Contacted, Closed) và thêm Ghi chú (Notes).
4.  **DBO:** Lưu lại lịch sử cập nhật. (Đã xử lý lỗi `PGRST116` bằng cách cấp quyền UPDATE cho Agent trên chính Lead của họ).

### 4.2. Luồng Nâng cấp Môi giới Tự động (Agent Request Flow)
1.  **GUI:** Member vào Setting, điền kinh nghiệm (JSONB form).
2.  **BUS:** Insert vào bảng `agent_requests` với trạng thái `pending`.
3.  **GUI (Admin):** Admin vào duyệt, bấm "Approve".
4.  **BUS:** Đổi trạng thái request. Gọi Supabase Auth Admin đổi Role từ `member` -> `agent`. Tạo sẵn 1 dòng hồ sơ rỗng trong bảng `agent_profiles`.
5.  **DBO:** Trigger `sync_role_to_auth_users` lập tức đồng bộ ngược Role từ `profiles` về `auth.users` để lần đăng nhập tiếp theo, User sẽ có đầy đủ quyền hạn của Agent.

### 4.3. Luồng Quản lý Cộng đồng (Forum Flow)
1.  **GUI:** Member đăng bài.
2.  **BUS:** Bộ lọc Censor Service quét từ khóa. Lỗi -> Từ chối. Pass -> Lưu trạng thái `pending`.
3.  **GUI (Admin):** Xem bài Pending. Bấm duyệt.
4.  **BUS:** Đổi trạng thái sang `approved`. Tự động bắn thư chúc mừng cho người viết. Lịch sử được lưu vào `system_logs`.

---
*Tài liệu này là minh chứng cho một hệ thống được thiết kế bài bản, chú trọng từng tiểu tiết từ bảo mật, kiến trúc mở rộng đến trải nghiệm người dùng cuối.*