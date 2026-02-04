import axios from '@/utils/axios';

export const getAuthorById = (id) => {
    return axios.get(`/api/authors/${id}`);
};

export const getStoriesByAuthor = (authorId) => {
    return axios.get(`/api/stories/author/${authorId}`);
};
