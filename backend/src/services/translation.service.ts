import dotenv from 'dotenv';

dotenv.config();
const MYMEMORY_EMAIL = process.env.MYMEMORY_EMAIL || ''; // Điền email của bạn vào .env

/**
 * Service gọi API dịch thuật tự động (MyMemory Translation API - Hoàn toàn miễn phí)
 */
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    // MyMemory sử dụng định dạng cặp ngôn ngữ (langpair). Ví dụ: vi|en, vi|zh
    const langpair = `vi|${targetLanguage}`;
    let url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;
    
    // Nếu có email, tự động gắn vào để được nâng limit lên 50.000 ký tự / ngày
    if (MYMEMORY_EMAIL) {
      url += `&de=${MYMEMORY_EMAIL}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    
    if (data && data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
    return text; // Trả về text gốc nếu API không tìm thấy bản dịch
  } catch (error) {
    console.error('[Translation Service] MyMemory API Error:', error);
    return text; // Fallback
  }
};