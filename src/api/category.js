import axios from '@/utils/axios';

export const getCategories = (page = 0, size = 20) => {
    return axios.get('/api/categories', {
        params: { page, size }
    });
};

export const getCategoryById = (id) => {
    return axios.get(`/api/categories/${id}`);
};
