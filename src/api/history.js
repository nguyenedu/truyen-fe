import axios from './axios';

// Get user's reading history (paginated)
export const getReadingHistory = (page = 0, size = 10) => {
    return axios.get('/api/reading-history', {
        params: { page, size }
    });
};

// Get reading history for a specific story
export const getStoryReadingHistory = (storyId) => {
    return axios.get(`/api/reading-history/story/${storyId}`);
};

// Save/Update reading history
export const saveReadingHistory = (storyId, chapterId) => {
    return axios.post(`/api/reading-history/story/${storyId}/chapter/${chapterId}`);
};

// Delete reading history for a story
export const deleteStoryHistory = (storyId) => {
    return axios.delete(`/api/reading-history/story/${storyId}`);
};

// Delete all reading history
export const deleteAllHistory = () => {
    return axios.delete('/api/reading-history/all');
};
