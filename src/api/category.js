// API thể loại - Lấy danh sách và chi tiết thể loại truyện
import axios from '@/utils/axios';

// Lấy danh sách thể loại có phân trang
export const getCategories = (page = 0, size = 20) => {
    return axios.get('/api/categories', {
        params: { page, size }
    });
};

// Lấy chi tiết thể loại theo ID
export const getCategoryById = (id) => {
    return axios.get(`/api/categories/${id}`);
};
