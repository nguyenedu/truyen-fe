// API chương truyện - Lấy danh sách chương và nội dung chương
import axios from '@/utils/axios';

// Lấy danh sách chương theo ID truyện
export const getChaptersByStoryId = (storyId) => {
    return axios.get(`/api/chapters/story/${storyId}`);
};

// Lấy nội dung chi tiết của một chương
export const getChapterById = (id) => {
    return axios.get(`/api/chapters/${id}`);
};
