import axios from './axios';

// Get user's favorite stories (paginated)
export const getFavorites = (page = 0, size = 10) => {
    return axios.get('/api/favorites', {
        params: { page, size }
    });
};

// Check if a story is favorited
export const checkFavorite = (storyId) => {
    return axios.get(`/api/favorites/check/${storyId}`);
};

// Add story to favorites
export const addFavorite = (storyId) => {
    return axios.post(`/api/favorites/${storyId}`);
};

// Remove story from favorites
export const removeFavorite = (storyId) => {
    return axios.delete(`/api/favorites/${storyId}`);
};

// Get favorite count for a story
export const getFavoriteCount = (storyId) => {
    return axios.get(`/api/favorites/count/${storyId}`);
};
