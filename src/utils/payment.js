// Tiện ích Payment - Hằng số, nhãn hiển thị, và helper functions cho hệ thống nạp xu
import { formatNumber } from '@/utils/formatters';

// === Trạng thái đơn thanh toán ===
export const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    EXPIRED: 'EXPIRED',
};

export const PAYMENT_STATUS_LABEL = {
    PENDING: 'Đang xử lý',
    SUCCESS: 'Thành công',
    FAILED: 'Thất bại',
    EXPIRED: 'Hết hạn',
};

export const PAYMENT_STATUS_SEVERITY = {
    PENDING: 'warn',
    SUCCESS: 'success',
    FAILED: 'danger',
    EXPIRED: 'secondary',
};

// === Loại giao dịch ví ===
export const TRANSACTION_TYPE = {
    CREDIT: 'CREDIT',
    DEBIT: 'DEBIT',
};

export const TRANSACTION_TYPE_LABEL = {
    CREDIT: 'Nạp xu',
    DEBIT: 'Tiêu xu',
};

// === Helper functions ===

// Lấy label và severity theo status đơn hàng
export const getPaymentStatusLabel = (status) =>
    PAYMENT_STATUS_LABEL[status] ?? status;

export const getPaymentStatusSeverity = (status) =>
    PAYMENT_STATUS_SEVERITY[status] ?? 'info';

// Lấy label loại giao dịch
export const getTransactionTypeLabel = (type) =>
    TRANSACTION_TYPE_LABEL[type] ?? type;

// Format giá tiền VNĐ
export const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0 ₫';
    return formatNumber(amount) + ' ₫';
};

// Format số xu với dấu cộng/trừ cho transaction
export const formatCoinAmount = (amount, type) => {
    const prefix = type === TRANSACTION_TYPE.CREDIT ? '+' : '-';
    return `${prefix}${formatNumber(Math.abs(amount))} xu`;
};

// Tổng xu nhận được từ một gói (coins + bonusCoins)
export const getTotalCoins = (pkg) =>
    (pkg?.coins ?? 0) + (pkg?.bonusCoins ?? 0);
