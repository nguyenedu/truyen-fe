import { ref } from 'vue';

export function usePagination(initialPageSize = 10) {
    const totalRecords = ref(0);
    const currentPage = ref(0);
    const pageSize = ref(initialPageSize);

    const onPageChange = (event, callback) => {
        currentPage.value = event.page;
        if (callback && typeof callback === 'function') {
            callback();
        }
    };

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
