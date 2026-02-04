import axios from '@/utils/axios';


export const rateStory = (storyId, rating, review = null) => {
    return axios.post('/api/ratings', {
        storyId,
        rating,
        review
    });
};


export const updateRating = (storyId, rating, review = null) => {
    return axios.put(`/api/ratings/${storyId}`, {
        storyId,
        rating,
        review
    });
};


export const deleteRating = (storyId) => {
    return axios.delete(`/api/ratings/${storyId}`);
};


export const getMyRating = (storyId) => {
    return axios.get(`/api/ratings/my/${storyId}`);
};


export const getStoryRatingInfo = (storyId) => {
    return axios.get(`/api/ratings/story/${storyId}`);
};
