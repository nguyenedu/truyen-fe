// API đánh giá - CRUD đánh giá sao và nhận xét cho truyện
import axios from '@/utils/axios';

// Đánh giá truyện (tạo mới)
export const rateStory = (storyId, rating, review = null) => {
    return axios.post('/api/ratings', {
        storyId,
        rating,
        review
    });
};

// Cập nhật đánh giá đã có
export const updateRating = (storyId, rating, review = null) => {
    return axios.put(`/api/ratings/${storyId}`, {
        storyId,
        rating,
        review
    });
};

// Xóa đánh giá của mình
export const deleteRating = (storyId) => {
    return axios.delete(`/api/ratings/${storyId}`);
};

// Lấy đánh giá của người dùng hiện tại cho truyện
export const getMyRating = (storyId) => {
    return axios.get(`/api/ratings/my/${storyId}`);
};

// Lấy thông tin đánh giá tổng hợp của truyện (điểm TB, tổng lượt)
export const getStoryRatingInfo = (storyId) => {
    return axios.get(`/api/ratings/story/${storyId}`);
};
