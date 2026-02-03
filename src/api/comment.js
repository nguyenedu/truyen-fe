import axios from './axios';

export const getStoryComments = (storyId, page = 0, size = 10) => {
    return axios.get(`/api/comments/story/${storyId}`, {
        params: { page, size }
    });
};

export const getChapterComments = (chapterId, page = 0, size = 10) => {
    return axios.get(`/api/comments/chapter/${chapterId}`, {
        params: { page, size }
    });
};


export const createComment = (storyId, chapterId, content) => {
    return axios.post('/api/comments', {
        storyId,
        chapterId,
        content
    });
};

export const updateComment = (commentId, content) => {
    return axios.put(`/api/comments/${commentId}`, {
        content
    });
};


export const deleteComment = (commentId) => {
    return axios.delete(`/api/comments/${commentId}`);
};


export const countStoryComments = (storyId) => {
    return axios.get(`/api/comments/count/story/${storyId}`);
};


export const countChapterComments = (chapterId) => {
    return axios.get(`/api/comments/count/chapter/${chapterId}`);
};
