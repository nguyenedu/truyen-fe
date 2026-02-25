// Composable phân trang - Quản lý state phân trang dùng chung
import { ref } from 'vue';

export function usePagination(initialPageSize = 10) {
    const totalRecords = ref(0);
    const currentPage = ref(0);
    const pageSize = ref(initialPageSize);

    // Xử lý thay đổi trang, gọi callback để tải dữ liệu mới
    const onPageChange = (event, callback) => {
        currentPage.value = event.page;
        if (callback && typeof callback === 'function') {
            callback();
        }
    };

    // Reset về trang đầu tiên
    const resetPagination = () => {
        currentPage.value = 0;
    };

    return {
        totalRecords,
        currentPage,
        pageSize,
        onPageChange,
        resetPagination
    };
}
