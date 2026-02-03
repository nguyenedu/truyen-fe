import axios from './axios';

export const getStories = (page = 0, size = 10) => {
    return axios.get('/api/stories', {
        params: { page, size }
    });
};

export const getStoryById = (id) => {
    return axios.get(`/api/stories/${id}`);
};

export const searchStories = (keyword, page = 0, size = 10) => {
    return axios.get('/api/stories/search', {
        params: { keyword, page, size }
    });
};

export const getStoriesByCategory = (categoryId, page = 0, size = 10) => {
    return axios.get(`/api/stories/category/${categoryId}`, {
        params: { page, size }
    });
};


export const getHotStories = (limit = 12) => {
    return axios.get('/api/trending', {
        params: {
            type: 'WEEKLY',
            limit
        }
    });
};


export const getLatestStories = (page = 0, size = 12) => {
    return axios.get('/api/stories/latest', {
        params: { page, size }
    });
};


export const filterStories = (filters = {}) => {
    const params = {
        page: filters.page || 0,
        size: filters.size || 12,
        sort: filters.sort || 'id,desc'
    };

    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.authorId) params.authorId = filters.authorId;
    if (filters.status) params.status = filters.status;
    if (filters.minChapters) params.minChapters = filters.minChapters;
    if (filters.maxChapters) params.maxChapters = filters.maxChapters;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    return axios.get('/api/stories/filter', { params });
};
