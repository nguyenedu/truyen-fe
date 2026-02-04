import axios from '@/utils/axios';


export const getFavorites = (page = 0, size = 10) => {
    return axios.get('/api/favorites', {
        params: { page, size }
    });
};


export const checkFavorite = (storyId) => {
    return axios.get(`/api/favorites/check/${storyId}`);
};


export const addFavorite = (storyId) => {
    return axios.post(`/api/favorites/${storyId}`);
};


export const removeFavorite = (storyId) => {
    return axios.delete(`/api/favorites/${storyId}`);
};


export const getFavoriteCount = (storyId) => {
    return axios.get(`/api/favorites/count/${storyId}`);
};
