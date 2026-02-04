import axios from '@/utils/axios';

export const getChaptersByStoryId = (storyId) => {
    return axios.get(`/api/chapters/story/${storyId}`);
};

export const getChapterById = (id) => {
    return axios.get(`/api/chapters/${id}`);
};
