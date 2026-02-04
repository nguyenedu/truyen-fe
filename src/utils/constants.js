export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const IMAGE_PLACEHOLDER = 'https://via.placeholder.com/300x400?text=No+Image';
export const AVATAR_PLACEHOLDER = 'https://via.placeholder.com/200?text=Avatar';

export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    BROWSE_PAGE_SIZE: 24,
    HISTORY_PAGE_SIZE: 12,
    CATEGORY_PAGE_SIZE: 12
};

export const STORY_STATUS = {
    ONGOING: 'ONGOING',
    COMPLETED: 'COMPLETED',
    PAUSED: 'PAUSED'
};

export const STORY_STATUS_OPTIONS = [
    { label: 'Tất cả', value: null },
    { label: 'Đang tiến hành', value: STORY_STATUS.ONGOING },
    { label: 'Hoàn thành', value: STORY_STATUS.COMPLETED },
    { label: 'Tạm dừng', value: STORY_STATUS.PAUSED }
];

export const SORT_OPTIONS = [
    { label: 'Mới nhất', value: 'createdAt,desc' },
    { label: 'Cũ nhất', value: 'createdAt,asc' },
    { label: 'Hot nhất (lượt xem)', value: 'totalViews,desc' },
    { label: 'Nhiều chương nhất', value: 'totalChapters,desc' },
    { label: 'Ít chương nhất', value: 'totalChapters,asc' },
    { label: 'A-Z', value: 'title,asc' },
    { label: 'Z-A', value: 'title,desc' }
];
