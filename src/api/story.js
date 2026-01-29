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

// Truyện HOT - Sử dụng TrendingController
export const getHotStories = (limit = 12) => {
    return axios.get('/api/trending', {
        params: {
            type: 'DAILY',
            limit
        }
    });
};

// Truyện mới cập nhật - Sử dụng StoryController
export const getLatestStories = (page = 0, size = 12) => {
    return axios.get('/api/stories/latest', {
        params: { page, size }
    });
};
