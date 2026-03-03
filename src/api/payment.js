// API thanh toán - Gói xu, tạo đơn VNPay, kiểm tra kết quả, lịch sử đơn hàng
import axios from '@/utils/axios';

// Lấy danh sách gói xu đang active
export const getCoinPackages = () => {
    return axios.get('/api/coin-packages');
};

// Tạo đơn nạp xu, trả về paymentUrl để redirect sang VNPay
export const createPaymentOrder = (packageId) => {
    return axios.post('/api/payments', { packageId });
};

// Tra cứu trạng thái đơn hàng theo orderCode (dùng sau khi VNPay redirect về)
export const getOrderStatus = (orderCode) => {
    return axios.get(`/api/payments/${orderCode}/status`);
};

// Lịch sử đơn hàng nạp xu của user hiện tại
export const getMyOrders = (page = 0, size = 10) => {
    return axios.get('/api/payments/my-orders', { params: { page, size } });
};
