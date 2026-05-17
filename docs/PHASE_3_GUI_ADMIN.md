# 🛡️ CHỐT SỔ GIAI ĐOẠN 3: LỚP GUI - ADMIN DASHBOARD & PHÂN QUYỀN UI

**Trạng thái:** Hoàn thành ✅

Tài liệu này tổng kết kiến trúc, luồng hoạt động và danh sách các tính năng quản trị đã được phát triển trong Giai đoạn 3 (Tầng GUI - Frontend Angular) dành cho hệ thống Admin và Agent Dashboard.

## 1. Kiến trúc Frontend (Angular)

Hệ thống Frontend được xây dựng bằng **Angular 17+** (Standalone Components) kết hợp với **TailwindCSS** để mang lại giao diện hiện đại, responsive và tốc độ phát triển nhanh chóng.

### 1.1. Cấu trúc Module Core & Shared
*   **Core Module:** Chứa các Singleton Services (như `ApiService`, `AuthService`, `UploadService`, `SocketService`), các Guards (`AdminGuard`, `AgentGuard`) để bảo vệ định tuyến (Routing) và Interceptors (`AuthInterceptor`) để tự động gắn JWT Token vào tất cả các HTTP Requests.
*   **Shared Module:** Cung cấp các UI Components dùng chung toàn hệ thống như `SkeletonLoader` (hiệu ứng khung xương lúc chờ tải dữ liệu) và các Custom Validators xử lý Form (Kiểm tra mật khẩu, email, số điện thoại Việt Nam).

### 1.2. State Management & Lazy Loading
*   Áp dụng định tuyến **Lazy Loading** cho Admin Module giúp giảm tải bundle size ban đầu khi user chỉ truy cập trang Public.
*   Sử dụng Reactive Forms để xử lý luồng dữ liệu hai chiều, đặc biệt sức mạnh của FormGroup lồng nhau (Nested Form) được dùng để xử lý mảng `attributes` JSONB của Bất động sản một cách mượt mà.

## 2. Phân quyền Giao diện (UI Role-Based Access Control)

Giao diện được tùy biến linh hoạt dựa trên JWT Role của người đăng nhập (Admin vs Agent):

*   **Bảo vệ bằng Guards:**
    *   `AdminGuard`: Chỉ cho phép Role `admin` truy cập các trang nhạy cảm như (Duyệt diễn đàn, Duyệt yêu cầu môi giới, Quản lý tài khoản, Nhật ký hệ thống).
    *   `AgentGuard`: Cho phép Role `admin` hoặc `agent` truy cập Dashboard quản lý BĐS, Leads, Thống kê cá nhân.
*   **Ẩn/Hiện Menu Thông minh:** Sidebar Menu tự động dùng directive `*ngIf` để kiểm tra quyền. Agent sẽ không nhìn thấy các tab quản trị cấp cao để đảm bảo an toàn thông tin và trải nghiệm tinh gọn.
*   **Lọc dữ liệu tự động (Cờ `manage=true`):** Khi Agent gọi API (VD: Lấy danh sách Properties hoặc Leads), frontend luôn truyền `manage=true`. Kết hợp RLS ở Backend, hệ thống đảm bảo Agent chỉ thao tác trên dữ liệu họ sở hữu hoặc được giao.

## 3. Các Trang chức năng (Pages) đã hoàn thiện

*   **Authentication (Xác thực):** Hệ thống Đăng nhập, Đăng ký. Luồng Quên/Khôi phục mật khẩu sử dụng RxJS timer chống Spam và tích hợp liên kết Resend Email.
*   **Properties Manage (Bất động sản):** Tìm kiếm phân trang. Tạo/Sửa BĐS với Form động `attributes` (JSONB) cho Diện tích, Số tầng, Hướng... Kéo thả upload nhiều hình ảnh đồng thời lên Cloudinary. Có tính năng set Thumbnail và Soft Delete.
*   **CRM & Agent Requests:** Giao diện cho phép Admin Duyệt/Từ chối hồ sơ môi giới. Bảng theo dõi thông tin khách hàng, cập nhật trạng thái và ghi chú. Hỗ trợ Socket.io real-time.
*   **Forum Approval:** Hệ thống duyệt bài viết (Pending -> Approved) và xử lý báo cáo vi phạm (Reports) của cộng đồng.
*   **Translations Manage:** Giao diện 2 cột giúp Admin đối chiếu và duyệt bản dịch tự động BĐS từ Tiếng Việt sang Tiếng Anh.
*   **System Logs & Stats:** Biểu đồ hiển thị tổng quan hệ thống. Theo dõi lịch sử tạo/sửa/xóa 24/7.

## 4. Trải nghiệm người dùng (UX Highlights)

1.  **Skeleton Loading:** Áp dụng thay thế vòng xoay Loading nhàm chán bằng hiệu ứng khung xương, giảm bớt tỷ lệ thoát trang.
2.  **ChangeDetectorRef:** Chủ động ép Angular render lại DOM ngay khi có phản hồi API để loại bỏ tình trạng kẹt UI khi làm việc với Async promises.
3.  **Tích hợp Form Toggle:** Các form tạo mới/chỉnh sửa sử dụng cơ chế Toggle thay vì điều hướng (redirect) trang, mang lại cảm giác của một Single Page App (SPA) đúng nghĩa.

*Sẵn sàng tiến tới Giai đoạn 4: Thiết kế Theme Engine cho Khách hàng vãng lai.*