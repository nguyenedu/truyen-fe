import axios from './axios';


export const getReadingHistory = (page = 0, size = 10) => {
    return axios.get('/api/reading-history', {
        params: { page, size }
    });
};


export const getStoryReadingHistory = (storyId) => {
    return axios.get(`/api/reading-history/story/${storyId}`);
};


export const saveReadingHistory = (storyId, chapterId) => {
    return axios.post(`/api/reading-history/story/${storyId}/chapter/${chapterId}`);
};


export const deleteStoryHistory = (storyId) => {
    return axios.delete(`/api/reading-history/story/${storyId}`);
};


export const deleteAllHistory = () => {
    return axios.delete('/api/reading-history/all');
};
