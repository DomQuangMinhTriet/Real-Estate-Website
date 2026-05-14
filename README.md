# 🏢 Pro-RealEstate Platform: Multi-Theme Solution

[![Tech Stack](https://img.shields.io/badge/Stack-Angular%20%7C%20Node.js%20%7C%20Supabase-blue)](https://github.com/your-username/your-repo)
[![Architecture](https://img.shields.io/badge/Architecture-GUI--BLL--DAL-orange)](#system-architecture)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel%20%26%20Railway-green)](#deployment)

Đây là dự án Website thương mại Bất động sản hoàn chỉnh, được xây dựng với mục tiêu tối ưu hóa UI/UX thông qua hệ thống **Multi-Theme Engine** và quản lý dữ liệu linh hoạt bằng kiến trúc **3 lớp (3-Tier)**.

---

## 🌟 Tính năng mũi nhọn (Key Features)

### 🎨 Multi-Theme Engine
*   **Dynamic Loading:** Tự động nạp Theme (Luxury, Minimalist, Eco-Green) dựa trên cấu hình dự án từ Database.
*   **High Customization:** Thay đổi 80-90% giao diện giữa các theme mà không ảnh hưởng đến logic core.
*   **Performance:** Sử dụng Angular Lazy Loading để tối ưu tốc độ tải trang cho từng theme.

### 🏗️ Kiến trúc Hệ thống (System Architecture)
Dự án tuân thủ nghiêm ngặt mô hình phân tách 3 lớp:
*   **GUI (Presentation Layer):** Xây dựng bằng Angular, tập trung vào trải nghiệm Mobile-Responsive và State Management.
*   **BLL (Business Logic Layer):** Node.js & Express làm nhạc trưởng điều phối API, bảo mật RBAC và tích hợp dịch vụ bên thứ 3.
*   **DAL/DBO (Data Access Layer):** Tận dụng Supabase (PostgreSQL) với Row Level Security (RLS) và kiểu dữ liệu **JSONB** để xử lý thuộc tính BĐS linh hoạt.

### 👥 Quản lý & Cộng đồng
*   **RBAC (Role-Based Access Control):** Phân quyền chặt chẽ giữa Admin, Agent và Member.
*   **Agent Portal:** Dashboard quản lý sản phẩm và Lead dành riêng cho môi giới (bị giới hạn quyền truy cập nhạy cảm).
*   **Forum System:** Diễn đàn thảo luận có cơ chế kiểm duyệt bài viết (Approval Queue) và lọc từ ngữ tự động (Auto-censor).

### 🌐 Đa ngôn ngữ & Tự động hóa
*   **Auto-Translation:** Tích hợp API dịch thuật tự động cho nội dung dự án (Việt, Anh, Trung, Hàn).
*   **Lead Capture:** Hệ thống nhận diện khách hàng quan tâm và bắn thông báo tức thời qua **Resend Email API**.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Angular 17+, RxJS, TailwindCSS, ngx-translate |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | Supabase (PostgreSQL), JSONB, RLS |
| **Media & Mail** | Cloudinary, Resend API |
| **Infrastructure** | Vercel (Frontend), Railway (Backend) |

---

## 📂 Cấu trúc thư mục (Project Structure)

```text
REAL-ESTATE-PLATFORM/
├── docs/         # Tài liệu dự án (API, Database, Hướng dẫn sử dụng)
├── database/     # SQL Scripts & RLS Policies (DBO)
├── backend/      # Express API, Middlewares, Services (BUS)
└── frontend/     # Angular App, Theme Engine, Admin Dashboard (GUI)
```

---

🚀 Cài đặt (Setup)
### 1. Database
Chạy các script SQL trong thư mục `/database` trên SQL Editor của Supabase theo thứ tự đánh số.

### 2. Backend
```bash
cd backend && npm install
# Tạo file .env và điền các API Keys (Supabase, Cloudinary, Resend)
npm run dev
```

### 3. Frontend
```bash
cd frontend && npm install
ng serve
```

---

📋 Roadmap & Checklist
Dự án được thực hiện theo quy trình chuyên nghiệp bao gồm 5 giai đoạn chính:

* **Giai đoạn 1: DBO** - Khởi tạo Database Schema, phân quyền và bảo mật RLS tại gốc (Supabase).
* **Giai đoạn 2: BUS** - Xây dựng API Nhạc trưởng, Core Logic & Global Error Handling (Node.js).
* **Giai đoạn 3: GUI Admin** - Phát triển Dashboard quản trị phân quyền cho Admin & Agent (Angular).
* **Giai đoạn 4: GUI Themes** - Triển khai Multi-Theme Engine, SEO & trải nghiệm người dùng tối ưu.
* **Giai đoạn 5: Deploy & QA** - Kiểm thử bảo mật, QA và Go-live (Vercel & Railway).
