// API yêu thích - Quản lý danh sách truyện yêu thích của người dùng
import axios from '@/utils/axios';

// Lấy danh sách truyện yêu thích có phân trang
export const getFavorites = (page = 0, size = 10) => {
    return axios.get('/api/favorites', {
        params: { page, size }
    });
};

// Kiểm tra truyện đã được yêu thích chưa
export const checkFavorite = (storyId) => {
    return axios.get(`/api/favorites/check/${storyId}`);
};

// Thêm truyện vào danh sách yêu thích
export const addFavorite = (storyId) => {
    return axios.post(`/api/favorites/${storyId}`);
};

// Xóa truyện khỏi danh sách yêu thích
export const removeFavorite = (storyId) => {
    return axios.delete(`/api/favorites/${storyId}`);
};

// Đếm số lượt yêu thích của truyện
export const getFavoriteCount = (storyId) => {
    return axios.get(`/api/favorites/count/${storyId}`);
};
