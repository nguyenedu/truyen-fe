// Composable tìm kiếm - Quản lý bộ lọc, từ khóa, và tham số tìm kiếm truyện
import { ref, watch } from 'vue';
import { getCategories } from '@/api/category';
import { STORY_STATUS_OPTIONS, SORT_OPTIONS } from '@/utils/constants';

export function useSearch() {
    // === State bộ lọc ===
    const keyword = ref('');
    const selectedStatus = ref(null);
    const selectedCategories = ref([]);
    const categoryOptions = ref([]);
    const selectedSort = ref(SORT_OPTIONS[0]);
    const minChapters = ref(null);
    const maxChapters = ref(null);

    // Tải danh sách thể loại cho dropdown bộ lọc
    const fetchCategories = async () => {
        try {
            const response = await getCategories(0, 50);
            const data = response.data.data;
            const categoryList = Array.isArray(data) ? data : (data.content || []);
            categoryOptions.value = categoryList.map(c => ({
                label: c.name,
                value: c.id
            }));
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Đặt lại tất cả bộ lọc về mặc định
    const resetFilters = () => {
        keyword.value = '';
        selectedStatus.value = null;
        selectedCategories.value = [];
        selectedSort.value = SORT_OPTIONS[0];
        minChapters.value = null;
        maxChapters.value = null;
    };

    // Xây dựng tham số query từ các bộ lọc hiện tại
    const getFilterParams = (currentPage, pageSize) => {
        const params = {
            page: currentPage,
            size: pageSize,
            sort: selectedSort.value?.value || 'createdAt,desc'
        };

        // Chỉ thêm tham số có giá trị
        if (keyword.value) params.keyword = keyword.value;
        if (selectedStatus.value) params.status = selectedStatus.value;
        if (selectedCategories.value && selectedCategories.value.length > 0) {
            params.categoryIds = selectedCategories.value;
        }
        if (minChapters.value) params.minChapters = minChapters.value;
        if (maxChapters.value) params.maxChapters = maxChapters.value;

        return params;
    };

    return {
        keyword,
        selectedStatus,
        selectedCategories,
        categoryOptions,
        selectedSort,
        minChapters,
        maxChapters,
        statusOptions: STORY_STATUS_OPTIONS,
        sortOptions: SORT_OPTIONS,
        fetchCategories,
        resetFilters,
        getFilterParams
    };
}
