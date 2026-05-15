import { Request, Response, NextFunction } from 'express';
import { uploadMedia } from '../services/upload.service';
import fs from 'fs';

export const uploadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Kiểm tra xem có file được gửi lên không
    if (!req.file) {
      res.status(400).json({ error: 'Không tìm thấy file tải lên.', code: 400 });
      return;
    }

    // Đường dẫn tạm thời của file trên server cục bộ
    const localFilePath = req.file.path;

    try {
      // Gọi service đẩy file lên Cloudinary
      const secureUrl = await uploadMedia(localFilePath);

      // Xóa file tạm trên server cục bộ sau khi đã upload xong để giải phóng bộ nhớ
      fs.unlink(localFilePath, (err) => {
        if (err) console.error('[Upload Controller] Failed to delete local temp file:', err);
      });

      res.status(200).json({
        status: 'success',
        message: 'Upload thành công!',
        data: { url: secureUrl }
      });
    } catch (uploadError) {
      // Đảm bảo xóa file tạm ngay cả khi upload lên Cloudinary gặp lỗi
      fs.unlink(localFilePath, (err) => {
        if (err) console.error('[Upload Controller] Failed to delete temp file after error:', err);
      });
      throw uploadError;
    }
  } catch (error) {
    next(error);
  }
};