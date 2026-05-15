import { Router } from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/upload.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import os from 'os';

const router = Router();

// Cấu hình Multer lưu trữ file tạm thời
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, os.tmpdir()); // Tự động lấy thư mục tạm chuẩn của hệ điều hành (Windows/Linux/macOS)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn file 5MB
});

// Endpoint tải lên (Chỉ Admin/Agent/Member đã đăng nhập mới được upload để tránh spam)
// 'file' chính là key body nhận vào từ Frontend
router.post('/', verifyToken, upload.single('file'), uploadFile);

export default router;