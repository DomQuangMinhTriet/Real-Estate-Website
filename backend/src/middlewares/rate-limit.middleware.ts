import rateLimit from 'express-rate-limit';

export const forumRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // Thời gian 1 phút
  max: 1, // Giới hạn 1 request / 1 phút trên mỗi IP
  message: { error: 'Bạn thao tác quá nhanh. Vui lòng thử lại sau 1 phút.', code: 429 },
  standardHeaders: true,
  legacyHeaders: false,
});