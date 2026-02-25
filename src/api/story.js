// API truyện - Lấy danh sách, chi tiết, tìm kiếm và lọc truyện
import axios from '@/utils/axios';

// Lấy danh sách truyện có phân trang
export const getStories = (page = 0, size = 10) => {
    return axios.get('/api/stories', {
        params: { page, size }
    });
};

// Lấy chi tiết truyện theo ID
export const getStoryById = (id) => {
    return axios.get(`/api/stories/${id}`);
};

// Tìm kiếm truyện theo từ khóa
export const searchStories = (keyword, page = 0, size = 10) => {
    return axios.get('/api/stories/search', {
        params: { keyword, page, size }
    });
};

// Lấy truyện theo thể loại
export const getStoriesByCategory = (categoryId, page = 0, size = 10) => {
    return axios.get(`/api/stories/category/${categoryId}`, {
        params: { page, size }
    });
};

// Lấy truyện hot (trending tuần)
export const getHotStories = (limit = 12) => {
    return axios.get('/api/trending', {
        params: {
            type: 'WEEKLY',
            limit
        }
    });
};

// Lấy truyện mới cập nhật
export const getLatestStories = (page = 0, size = 12) => {
    return axios.get('/api/stories/latest', {
        params: { page, size }
    });
};

// Lọc truyện nâng cao với nhiều tiêu chí
export const filterStories = (filters = {}) => {
    const params = {
        page: filters.page || 0,
        size: filters.size || 12,
        sort: filters.sort || 'id,desc'
    };

    // Chỉ thêm tham số nếu có giá trị (tránh gửi thừa)
    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.authorId) params.authorId = filters.authorId;
    if (filters.status) params.status = filters.status;
    if (filters.minChapters) params.minChapters = filters.minChapters;
    if (filters.maxChapters) params.maxChapters = filters.maxChapters;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.categoryIds) params.categoryIds = filters.categoryIds;

    return axios.get('/api/stories/filter', { params });
};
