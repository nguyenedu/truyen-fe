import axios from './axios';

// Rate a story
export const rateStory = (storyId, rating, review = null) => {
    return axios.post('/api/ratings', {
        storyId,
        rating,
        review
    });
};

// Update rating
export const updateRating = (storyId, rating, review = null) => {
    return axios.put(`/api/ratings/${storyId}`, {
        storyId,
        rating,
        review
    });
};

// Delete rating
export const deleteRating = (storyId) => {
    return axios.delete(`/api/ratings/${storyId}`);
};

// Get my rating for a story
export const getMyRating = (storyId) => {
    return axios.get(`/api/ratings/my/${storyId}`);
};

// Get story rating info (average, count)
export const getStoryRatingInfo = (storyId) => {
    return axios.get(`/api/ratings/story/${storyId}`);
};
