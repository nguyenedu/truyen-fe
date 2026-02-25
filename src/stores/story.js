// Store truyện - Quản lý event cập nhật dữ liệu truyện giữa các component
import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useStoryStore = defineStore('story', () => {
    // Lưu thông tin story vừa được cập nhật (dùng như event bus)
    const lastUpdatedStory = ref(null);

    // Gọi khi dữ liệu story thay đổi (VD: sau khi đánh giá)
    const notifyStoryUpdated = (storyId, data) => {
        lastUpdatedStory.value = {
            storyId,
            ...data,
            timestamp: Date.now()
        };
    };

    return {
        lastUpdatedStory,
        notifyStoryUpdated
    };
});
