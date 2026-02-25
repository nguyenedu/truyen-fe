// API tìm kiếm - Gợi ý, xu hướng, và lịch sử tìm kiếm
import axios from '@/utils/axios';

// Lấy gợi ý tự động khi nhập từ khóa tìm kiếm
export const getSearchSuggestions = (query, limit = 5) => {
    return axios.get('/api/search/suggest', {
        params: { q: query, limit }
    });
};

// Lấy danh sách từ khóa đang thịnh hành
export const getTrendingSearches = (limit = 10) => {
    return axios.get('/api/search/trending', {
        params: { limit }
    });
};

// Lấy danh sách từ khóa phổ biến nhất
export const getPopularSearches = (limit = 10, withScores = false) => {
    return axios.get('/api/search/popular', {
        params: { limit, withScores }
    });
};

// Lấy lịch sử tìm kiếm của người dùng
export const getUserSearchHistory = (limit = 20) => {
    return axios.get('/api/search/history', {
        params: { limit }
    });
};
