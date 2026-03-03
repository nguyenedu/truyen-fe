<script setup>
// Trang kết quả thanh toán - Xử lý redirect từ VNPay và hiển thị kết quả
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWalletStore } from '@/stores/wallet';
import { getOrderStatus } from '@/api/payment';
import { formatNumber, formatDate } from '@/utils/formatters';
import { formatCurrency } from '@/utils/payment';

const route = useRoute();
const router = useRouter();
const walletStore = useWalletStore();

const status = ref('loading'); // 'loading' | 'success' | 'failed'
const orderDetail = ref(null);
const errorMsg = ref('');

const isSuccess = computed(() => status.value === 'success');
const isFailed = computed(() => status.value === 'failed');

onMounted(async () => {
    const queryStatus = route.query.status;
    const orderCode = route.query.orderCode;

    if (!orderCode) {
        status.value = 'failed';
        errorMsg.value = 'Không tìm thấy thông tin đơn hàng.';
        return;
    }

    if (queryStatus === 'success') {
        // Xác nhận lại với server
        try {
            const response = await getOrderStatus(orderCode);
            const order = response.data.data;
            orderDetail.value = order;

            if (order.status === 'SUCCESS') {
                status.value = 'success';
                // Refresh số dư ví sau khi nạp thành công
                await walletStore.fetchWallet();
            } else {
                status.value = 'failed';
                errorMsg.value = `Đơn hàng có trạng thái: ${order.status}`;
            }
        } catch (err) {
            status.value = 'failed';
            errorMsg.value = 'Không thể xác nhận kết quả từ server.';
        }
    } else {
        // VNPay trả về failed/cancel
        status.value = 'failed';
        // Vẫn thử lấy thông tin đơn hàng để hiển thị
        try {
            const response = await getOrderStatus(orderCode);
            orderDetail.value = response.data.data;
        } catch {
            // Không cần xử lý thêm
        }
    }
});
</script>

<template>
    <div class="result-page">
        <div class="result-card">
            <!-- Loading -->
            <div v-if="status === 'loading'" class="result-loading">
                <div class="loading-spinner"></div>
                <p class="loading-text">Đang xác nhận kết quả thanh toán...</p>
            </div>

            <!-- Thành công -->
            <div v-else-if="isSuccess" class="result-content">
                <div class="result-icon success-icon">✅</div>
                <h2 class="result-title success-title">Nạp xu thành công!</h2>
                <p class="result-desc">Xu đã được cộng vào ví của bạn</p>

                <!-- Chi tiết đơn hàng -->
                <div v-if="orderDetail" class="order-detail">
                    <div class="detail-row">
                        <span class="detail-label">Gói nạp</span>
                        <span class="detail-value">{{ orderDetail.packageName }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Số xu nhận</span>
                        <span class="detail-value coins-received">+{{ formatNumber(orderDetail.coinsToAdd) }} xu 🪙</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Số tiền</span>
                        <span class="detail-value">{{ formatCurrency(orderDetail.amount) }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Mã đơn hàng</span>
                        <span class="detail-value code-value">{{ orderDetail.orderCode }}</span>
                    </div>
                </div>

                <!-- Số dư mới -->
                <div class="new-balance">
                    <span class="balance-label">Số dư ví hiện tại</span>
                    <span class="balance-amount">🪙 {{ formatNumber(walletStore.balance) }} xu</span>
                </div>

                <div class="result-actions">
                    <router-link to="/" class="btn-primary">🏠 Về trang chủ</router-link>
                    <router-link to="/top-up" class="btn-secondary">🪙 Nạp thêm</router-link>
                </div>
            </div>

            <!-- Thất bại -->
            <div v-else-if="isFailed" class="result-content">
                <div class="result-icon failed-icon">❌</div>
                <h2 class="result-title failed-title">Thanh toán thất bại</h2>
                <p class="result-desc">{{ errorMsg || 'Giao dịch không thành công hoặc đã bị hủy.' }}</p>

                <div v-if="orderDetail" class="order-detail">
                    <div class="detail-row">
                        <span class="detail-label">Gói nạp</span>
                        <span class="detail-value">{{ orderDetail.packageName }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Số tiền</span>
                        <span class="detail-value">{{ formatCurrency(orderDetail.amount) }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Mã đơn hàng</span>
                        <span class="detail-value code-value">{{ orderDetail.orderCode }}</span>
                    </div>
                </div>

                <p class="failed-note">
                    Xu chưa bị trừ. Bạn có thể thử lại hoặc liên hệ hỗ trợ nếu cần.
                </p>

                <div class="result-actions">
                    <router-link to="/top-up" class="btn-primary">🔄 Thử lại</router-link>
                    <router-link to="/" class="btn-secondary">🏠 Về trang chủ</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.result-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
}

.result-card {
    background: white;
    border-radius: 2rem;
    padding: 3rem 2.5rem;
    max-width: 480px;
    width: 100%;
    box-shadow: 0 25px 50px -12px rgba(79, 70, 229, 0.15);
    border: 1px solid #e8eaf6;
    text-align: center;
}

/* Loading */
.result-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem 0;
}
.loading-spinner {
    width: 3rem;
    height: 3rem;
    border: 4px solid #e8eaf6;
    border-top-color: #4f46e5;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text {
    color: #6b7280;
    font-size: 1rem;
}

/* Result content */
.result-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
}

.result-icon { font-size: 4rem; line-height: 1; }

.result-title {
    font-size: 1.6rem;
    font-weight: 800;
    margin: 0;
}
.success-title { color: #166534; }
.failed-title { color: #991b1b; }

.result-desc {
    color: #6b7280;
    font-size: 0.95rem;
    margin: 0;
}

/* Chi tiết đơn hàng */
.order-detail {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 1.25rem;
    width: 100%;
    margin: 0.75rem 0;
    text-align: left;
}
.detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f1f5f9;
    gap: 1rem;
}
.detail-row:last-child { border-bottom: none; }
.detail-label {
    color: #64748b;
    font-size: 0.875rem;
    flex-shrink: 0;
}
.detail-value {
    color: #1e293b;
    font-weight: 600;
    font-size: 0.9rem;
    text-align: right;
}
.coins-received {
    color: #059669;
    font-size: 1.1rem;
}
.code-value {
    font-family: monospace;
    font-size: 0.8rem;
    color: #6b7280;
}

/* Số dư mới */
.new-balance {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
    border-radius: 1rem;
    padding: 1rem 1.5rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}
.new-balance .balance-label {
    font-size: 0.8rem;
    opacity: 0.85;
}
.new-balance .balance-amount {
    font-size: 1.5rem;
    font-weight: 800;
}

.failed-note {
    color: #92400e;
    background: #fef3c7;
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    width: 100%;
    text-align: left;
}

/* Nút */
.result-actions {
    display: flex;
    gap: 0.875rem;
    width: 100%;
    margin-top: 0.5rem;
    flex-wrap: wrap;
}
.btn-primary, .btn-secondary {
    flex: 1;
    min-width: 130px;
    padding: 0.8rem 1rem;
    border-radius: 0.875rem;
    font-weight: 700;
    font-size: 0.9rem;
    text-decoration: none;
    text-align: center;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
}
.btn-primary {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}
.btn-primary:hover {
    background: linear-gradient(135deg, #4338ca, #6d28d9);
    transform: translateY(-1px);
}
.btn-secondary {
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;
}
.btn-secondary:hover {
    background: #e8eaf6;
    color: #4f46e5;
    transform: translateY(-1px);
}

@media (max-width: 480px) {
    .result-card { padding: 2rem 1.25rem; }
    .result-actions { flex-direction: column; }
}
</style>
