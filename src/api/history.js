// API lịch sử đọc - Quản lý lịch sử đọc truyện của người dùng
import axios from '@/utils/axios';

// Lấy lịch sử đọc có phân trang
export const getReadingHistory = (page = 0, size = 10) => {
    return axios.get('/api/reading-history', {
        params: { page, size }
    });
};

// Lấy lịch sử đọc của một truyện cụ thể
export const getStoryReadingHistory = (storyId) => {
    return axios.get(`/api/reading-history/story/${storyId}`);
};

// Lưu vị trí đọc hiện tại (truyện + chương)
export const saveReadingHistory = (storyId, chapterId) => {
    return axios.post(`/api/reading-history/story/${storyId}/chapter/${chapterId}`);
};

// Xóa lịch sử đọc của một truyện
export const deleteStoryHistory = (storyId) => {
    return axios.delete(`/api/reading-history/story/${storyId}`);
};

// Xóa toàn bộ lịch sử đọc
export const deleteAllHistory = () => {
    return axios.delete('/api/reading-history/all');
};
