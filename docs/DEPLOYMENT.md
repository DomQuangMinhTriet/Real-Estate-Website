# 🚀 HƯỚNG DẪN TRIỂN KHAI LÊN PRODUCTION (DEPLOYMENT GUIDE)

Dự án Pro-RealEstate sử dụng kiến trúc tách rời (Decoupled Architecture), do đó chúng ta sẽ deploy Backend và Frontend lên các nền tảng Cloud khác nhau để tối ưu chi phí và hiệu năng.

---

## 1. Triển khai Backend (Node.js) lên Railway.app

Railway là nền tảng tối ưu cho các ứng dụng Node.js đòi hỏi kết nối ổn định (WebSocket/Socket.io).

1. Đăng nhập vào Railway.app.
2. Chọn **New Project** -> **Deploy from GitHub repo**.
3. Chọn repo chứa mã nguồn Backend.
4. Vào tab **Variables**, thêm toàn bộ các biến môi trường từ file `.env` cục bộ (SUPABASE_URL, CLOUDINARY_API_KEY, RESEND_API_KEY...).
5. Tại tab **Settings**, sửa Start Command thành: `npm run build && npm start`.
6. Generate Domain (Railway sẽ cấp cho bạn 1 URL, ví dụ: `api-realestate.up.railway.app`).

---

## 2. Triển khai Frontend (Angular) lên Vercel

Vercel cung cấp bộ nhớ đệm (Edge Caching) cực tốt cho các ứng dụng Frontend.

1. Cập nhật URL Backend mới tạo vào file `environment.prod.ts` trong mã nguồn Angular.
2. Commit & Push lên GitHub.
3. Đăng nhập Vercel.com -> **Add New Project**.
4. Chọn Framework Preset là **Angular**.
5. Bấm Deploy và đợi hệ thống tự động Build. Hệ thống sẽ cấp cho bạn một tên miền HTTPS an toàn.