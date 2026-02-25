// API tác giả - Lấy thông tin và danh sách truyện của tác giả
import axios from '@/utils/axios';

// Lấy thông tin tác giả theo ID
export const getAuthorById = (id) => {
    return axios.get(`/api/authors/${id}`);
};

// Lấy danh sách truyện của tác giả
export const getStoriesByAuthor = (authorId) => {
    return axios.get(`/api/stories/author/${authorId}`);
};
