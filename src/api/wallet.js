// API ví điện tử - Xem số dư và lịch sử giao dịch
import axios from '@/utils/axios';

// Lấy ví của user hiện tại (balance + username)
export const getMyWallet = () => {
    return axios.get('/api/wallet');
};

// Lấy lịch sử giao dịch của user (phân trang)
export const getMyTransactions = (page = 0, size = 10) => {
    return axios.get('/api/wallet/transactions', { params: { page, size } });
};
