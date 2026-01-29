import axios from './axios';

// Get comments for a story
export const getStoryComments = (storyId, page = 0, size = 10) => {
    return axios.get(`/api/comments/story/${storyId}`, {
        params: { page, size }
    });
};

// Get comments for a chapter
export const getChapterComments = (chapterId, page = 0, size = 10) => {
    return axios.get(`/api/comments/chapter/${chapterId}`, {
        params: { page, size }
    });
};

// Create comment
export const createComment = (storyId, chapterId, content) => {
    return axios.post('/api/comments', {
        storyId,
        chapterId,
        content
    });
};

// Update comment
export const updateComment = (commentId, content) => {
    return axios.put(`/api/comments/${commentId}`, {
        content
    });
};

// Delete comment
export const deleteComment = (commentId) => {
    return axios.delete(`/api/comments/${commentId}`);
};

// Count comments for story
export const countStoryComments = (storyId) => {
    return axios.get(`/api/comments/count/story/${storyId}`);
};

// Count comments for chapter
export const countChapterComments = (chapterId) => {
    return axios.get(`/api/comments/count/chapter/${chapterId}`);
};
