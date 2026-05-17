# 📖 HƯỚNG DẪN SỬ DỤNG (USER MANUAL)

Tài liệu hướng dẫn thao tác trên Hệ thống Quản trị (Dashboard) của nền tảng Pro-RealEstate dành cho hai đối tượng chính: **Quản trị viên (Admin)** và **Môi giới (Agent)**.

---

## 1. Hướng dẫn Chung (Đăng nhập & Tài khoản)

### 1.1. Đăng nhập và Quên mật khẩu
1. Truy cập đường dẫn: `http://[ten-mien]/auth/login`
2. Nhập Email và Mật khẩu đã được cấp hoặc đã đăng ký.
3. Nếu quên mật khẩu, chọn **"Quên mật khẩu?"**. Hệ thống sẽ yêu cầu nhập Email để gửi liên kết khôi phục.
   * *Lưu ý:* Cần đợi 60 giây giữa các lần gửi yêu cầu khôi phục để tránh spam hệ thống. Nhớ kiểm tra thư mục Spam/Junk.

### 1.2. Cập nhật Hồ sơ cá nhân (Account Settings)
1. Tại giao diện Dashboard, bấm vào Avatar góc trên cùng bên phải -> Chọn **Cài đặt tài khoản**.
2. Cập nhật thông tin cơ bản: Tên hiển thị, Số điện thoại, Đổi mật khẩu.
3. (Với người dùng thường - Member): Tại đây sẽ có thêm mục **"Đăng ký làm Môi giới"** để điền kinh nghiệm và gửi yêu cầu nâng cấp tài khoản lên Admin.

---

## 2. Dành cho Môi giới (Agent)

Môi giới là nhân sự trực tiếp đăng bán Bất động sản và quản lý nguồn khách hàng.

### 2.1. Quản lý Bất động sản (Properties)
1. **Truy cập:** Menu Trái -> `Quản lý Bất động sản`.
2. **Danh sách:** Hiển thị 100% các BĐS do bạn đăng tải hoặc được Ban quản trị phân công.
3. **Thêm Mới / Sửa:**
   * Điền Tiêu đề, Giá, chọn Danh mục (Căn hộ, Đất nền,...).
   * **Thông số chi tiết:** Điền diện tích, số tầng, hướng...
   * **Kéo thả hình ảnh:** Upload trực tiếp file từ máy tính. Có thể click xóa ảnh, ảnh đầu tiên luôn mặc định là "Ảnh bìa" (Thumbnail).
4. **Xóa BĐS:** Bấm "Xóa". BĐS sẽ được ẩn khỏi giao diện khách hàng (Chuyển vào thùng rác).

### 2.2. Quản lý Khách hàng (Leads CRM)
1. **Truy cập:** Menu Trái -> `Quản lý Khách hàng`.
2. **Tiếp nhận:** Khi có khách hàng gửi yêu cầu tư vấn trên Web, trạng thái là "New" và bạn sẽ nhận được Email thông báo.
3. **Xử lý:** Cập nhật Trạng thái (Đã liên hệ, Đã chốt, Hủy) và cập nhật cột **Ghi chú** để tiện theo dõi tiến trình chăm sóc.

---

## 3. Dành cho Quản trị viên (Admin)

Quản trị viên có toàn quyền xem và thao tác trên mọi hệ thống.

### 3.1. Quản lý Người dùng & Duyệt Yêu cầu Môi giới
1. **Users Manage:** Xem danh sách toàn bộ thành viên. Thay đổi Role (Phân quyền) bất kỳ ai.
2. **Agent Requests:** Khi duyệt đơn (Approve), hệ thống tự động thăng cấp người đó thành Agent và cấp quyền sử dụng Dashboard ngay lập tức.

### 3.2. Quản lý Danh mục & Dự án
1. Thêm mới các Danh mục BĐS (VD: Khu nghỉ dưỡng, Shophouse...).
2. Tạo mới Dự án, thiết lập ID Giao diện (Theme ID) để hệ thống tự động đổi giao diện Public phù hợp với Dự án đó.

### 3.3. Kiểm duyệt Cộng đồng (Forum & Báo cáo)
1. **Truy cập:** Menu Trái -> `Duyệt Diễn đàn`.
2. Đọc và quyết định Cho phép duyệt / Xóa bỏ các bài viết do user đăng tải. Xử lý bài viết rác từ tab "Báo cáo vi phạm".

### 3.4. Quản lý Dịch thuật Đa ngôn ngữ
1. Hệ thống tự động dịch BĐS mới sang Tiếng Anh (thông qua Trí tuệ Nhân tạo).
2. Truy cập `Quản lý Dịch thuật` để xem lại các bản dịch này.
3. Nếu dịch sai, Admin có thể sửa trực tiếp bên khung Tiếng Anh và bấm **Lưu & Duyệt**. Bản dịch chuẩn sẽ xuất hiện trên Website Public.

### 3.5. Kiểm soát Hệ thống (System Logs)
1. **Truy cập:** Menu Trái -> `Nhật ký Hệ thống`.
2. Theo dõi 24/7 mọi hành động (Sửa/Xóa/Thêm) của hệ thống. Nhằm phát hiện nhanh ai là người đã thao tác sai trên dữ liệu nhạy cảm.

---
*Mọi thắc mắc kỹ thuật vui lòng liên hệ đội ngũ phát triển.*