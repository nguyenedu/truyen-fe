// API bình luận - CRUD bình luận, like/unlike, đếm bình luận
import axios from '@/utils/axios';

// Lấy bình luận của truyện có phân trang
export const getStoryComments = (storyId, page = 0, size = 10) => {
    return axios.get(`/api/comments/story/${storyId}`, {
        params: { page, size }
    });
};

// Lấy bình luận của chương có phân trang
export const getChapterComments = (chapterId, page = 0, size = 10) => {
    return axios.get(`/api/comments/chapter/${chapterId}`, {
        params: { page, size }
    });
};

// Tạo bình luận mới cho truyện hoặc chương
export const createComment = (storyId, chapterId, content) => {
    return axios.post('/api/comments', {
        storyId,
        chapterId,
        content
    });
};

// Cập nhật nội dung bình luận
export const updateComment = (commentId, content) => {
    return axios.put(`/api/comments/${commentId}`, {
        content
    });
};

// Xóa bình luận
export const deleteComment = (commentId) => {
    return axios.delete(`/api/comments/${commentId}`);
};

// Bật/tắt like bình luận
export const toggleLikeComment = (commentId) => {
    return axios.post(`/api/comment-likes/toggle/${commentId}`);
};

// Đếm tổng bình luận của truyện
export const countStoryComments = (storyId) => {
    return axios.get(`/api/comments/count/story/${storyId}`);
};

// Đếm tổng bình luận của chương
export const countChapterComments = (chapterId) => {
    return axios.get(`/api/comments/count/chapter/${chapterId}`);
};
