/**
 * Chuyển đổi chuỗi Tiếng Việt có dấu thành slug không dấu cho URL
 */
export const generateSlug = (text: string): string => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Tách dấu ra khỏi ký tự (Ví dụ: ế -> e + ̂ + ́)
    .replace(/[\u0300-\u036f]/g, '') // Xóa các dấu
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/[^\w\-]+/g, '') // Xóa các ký tự không phải chữ, số hoặc gạch ngang
    .replace(/\-\-+/g, '-') // Xóa nhiều gạch ngang liên tiếp
    .replace(/^-+|-+$/g, ''); // Xóa gạch ngang ở đầu và cuối
};