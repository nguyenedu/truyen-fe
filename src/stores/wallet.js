// Store ví điện tử - Quản lý số dư xu và lịch sử giao dịch
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getMyWallet, getMyTransactions } from '@/api/wallet';

export const useWalletStore = defineStore('wallet', () => {

    // === State ===
    const balance = ref(0);
    const transactions = ref([]);
    const transactionMeta = ref({ page: 0, totalPages: 0, totalElements: 0 });
    const loading = ref(false);

    // === Actions ===

    // Tải số dư ví từ server
    const fetchWallet = async () => {
        try {
            const response = await getMyWallet();
            balance.value = response.data.data?.balance ?? 0;
        } catch (error) {
            console.error('Lỗi khi tải ví:', error);
        }
    };

    // Tải lịch sử giao dịch (phân trang)
    const fetchTransactions = async (page = 0, size = 10) => {
        loading.value = true;
        try {
            const response = await getMyTransactions(page, size);
            const data = response.data.data;
            transactions.value = data.content ?? [];
            transactionMeta.value = {
                page: data.number,
                totalPages: data.totalPages,
                totalElements: data.totalElements,
            };
        } catch (error) {
            console.error('Lỗi khi tải lịch sử giao dịch:', error);
        } finally {
            loading.value = false;
        }
    };

    // Reset toàn bộ state (khi logout)
    const reset = () => {
        balance.value = 0;
        transactions.value = [];
        transactionMeta.value = { page: 0, totalPages: 0, totalElements: 0 };
    };

    return {
        balance,
        transactions,
        transactionMeta,
        loading,
        fetchWallet,
        fetchTransactions,
        reset,
    };
});
