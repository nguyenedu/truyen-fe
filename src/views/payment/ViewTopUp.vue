<script setup>
// Trang nạp xu - Chọn gói coin và thanh toán qua VNPay
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useWalletStore } from '@/stores/wallet';
import { getCoinPackages, createPaymentOrder } from '@/api/payment';
import { formatCurrency, getTotalCoins } from '@/utils/payment';
import { formatNumber } from '@/utils/formatters';

const router = useRouter();
const walletStore = useWalletStore();

const packages = ref([]);
const loadingPackages = ref(true);
const processingId = ref(null);
const errorMsg = ref('');

// Gói nào được đánh dấu "Phổ biến" (gói có coins cao thứ 2 tính từ đầu, hoặc ở giữa)
const popularIndex = computed(() => {
    if (packages.value.length < 3) return -1;
    return Math.floor(packages.value.length / 2);
});

onMounted(async () => {
    // Tải đồng thời gói xu và ví
    await Promise.allSettled([loadPackages(), walletStore.fetchWallet()]);
});

const loadPackages = async () => {
    loadingPackages.value = true;
    try {
        const response = await getCoinPackages();
        packages.value = response.data.data ?? [];
    } catch (err) {
        errorMsg.value = 'Không thể tải danh sách gói xu. Vui lòng thử lại.';
    } finally {
        loadingPackages.value = false;
    }
};

const handleTopUp = async (pkg) => {
    if (processingId.value) return;
    processingId.value = pkg.id;
    errorMsg.value = '';
    try {
        const response = await createPaymentOrder(pkg.id);
        const { paymentUrl } = response.data.data;
        // Redirect sang VNPay
        window.location.href = paymentUrl;
    } catch (err) {
        errorMsg.value = err.response?.data?.message ?? 'Có lỗi xảy ra. Vui lòng thử lại.';
        processingId.value = null;
    }
};
</script>

<template>
    <div class="topup-page">
        <!-- Header -->
        <div class="topup-header">
            <div class="topup-header-inner">
                <router-link to="/" class="btn-back-home">
                    ← Trang chủ
                </router-link>
                <h1 class="topup-title">
                    <span class="coin-icon">🪙</span>
                    Nạp Xu
                </h1>
                <p class="topup-subtitle">Chọn gói xu phù hợp để mở khóa chương VIP</p>

                <!-- Số dư hiện tại -->
                <div class="balance-badge">
                    <span class="balance-icon">🪙</span>
                    <span class="balance-label">Số dư hiện tại:</span>
                    <span class="balance-value">{{ formatNumber(walletStore.balance) }} xu</span>
                    <router-link to="/wallet" class="wallet-link">Xem ví →</router-link>
                </div>
            </div>
        </div>

        <div class="topup-content">
            <!-- Error -->
            <div v-if="errorMsg" class="error-banner">
                <span>⚠️ {{ errorMsg }}</span>
                <button @click="errorMsg = ''" class="error-close">✕</button>
            </div>

            <!-- Loading skeleton -->
            <div v-if="loadingPackages" class="packages-grid">
                <div v-for="i in 4" :key="i" class="package-card skeleton-card">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-coins"></div>
                    <div class="skeleton-price"></div>
                    <div class="skeleton-btn"></div>
                </div>
            </div>

            <!-- Danh sách gói -->
            <div v-else class="packages-grid">
                <div
                    v-for="(pkg, idx) in packages"
                    :key="pkg.id"
                    class="package-card"
                    :class="{ 'package-popular': idx === popularIndex }"
                >
                    <!-- Badge phổ biến -->
                    <div v-if="idx === popularIndex" class="popular-badge">⭐ Phổ biến</div>

                    <!-- Tên gói -->
                    <h3 class="package-name">{{ pkg.name }}</h3>

                    <!-- Số xu -->
                    <div class="package-coins">
                        <span class="coins-main">{{ formatNumber(pkg.coins) }}</span>
                        <span class="coins-label"> xu</span>
                    </div>

                    <!-- Xu bonus -->
                    <div v-if="pkg.bonusCoins > 0" class="bonus-row">
                        <span class="bonus-tag">+{{ formatNumber(pkg.bonusCoins) }} xu thưởng</span>
                    </div>
                    <div v-else class="bonus-row bonus-empty">
                        &nbsp;
                    </div>

                    <!-- Tổng xu -->
                    <div v-if="pkg.bonusCoins > 0" class="total-coins">
                        Tổng: <strong>{{ formatNumber(getTotalCoins(pkg)) }} xu</strong>
                    </div>

                    <!-- Giá -->
                    <div class="package-price">{{ formatCurrency(pkg.price) }}</div>

                    <!-- Nút nạp -->
                    <button
                        class="btn-topup"
                        :class="{ 'btn-topup-popular': idx === popularIndex }"
                        :disabled="processingId !== null"
                        @click="handleTopUp(pkg)"
                    >
                        <span v-if="processingId === pkg.id" class="btn-spinner">⏳</span>
                        <span v-else>Nạp ngay</span>
                    </button>
                </div>
            </div>

            <!-- Hướng dẫn -->
            <div class="guide-section">
                <h3 class="guide-title">📋 Hướng dẫn nạp xu</h3>
                <div class="guide-steps">
                    <div class="guide-step">
                        <span class="step-num">1</span>
                        <span>Chọn gói xu phù hợp và bấm <strong>Nạp ngay</strong></span>
                    </div>
                    <div class="guide-step">
                        <span class="step-num">2</span>
                        <span>Thanh toán qua cổng VNPay (thẻ ngân hàng / ví điện tử)</span>
                    </div>
                    <div class="guide-step">
                        <span class="step-num">3</span>
                        <span>Xu được cộng vào ví ngay sau khi thanh toán thành công</span>
                    </div>
                    <div class="guide-step">
                        <span class="step-num">4</span>
                        <span>Dùng xu để mở khóa chương VIP và thưởng thức không giới hạn</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* ===== Trang nạp xu ===== */
.topup-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%);
}

/* Header */
.topup-header {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    padding: 3rem 1.5rem 4rem;
    text-align: center;
    position: relative;
    overflow: hidden;
}
.topup-header::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%);
    animation: pulse-bg 4s ease-in-out infinite;
}
@keyframes pulse-bg {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}
.topup-header-inner {
    position: relative;
    z-index: 1;
}
.btn-back-home {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: rgba(255,255,255,0.75);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    transition: color 0.2s;
}
.btn-back-home:hover { color: white; }
.topup-title {
    font-size: 2.5rem;
    font-weight: 900;
    color: white;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
}
.coin-icon { font-size: 2.8rem; }
.topup-subtitle {
    color: rgba(255,255,255,0.8);
    font-size: 1.1rem;
    margin-bottom: 2rem;
}

.balance-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.25);
    color: white;
    padding: 0.6rem 1.5rem;
    border-radius: 999px;
    font-size: 0.95rem;
    flex-wrap: wrap;
    justify-content: center;
}
.balance-label { opacity: 0.85; }
.balance-value { font-weight: 700; font-size: 1.05rem; }
.wallet-link {
    color: #c4b5fd;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
}
.wallet-link:hover { color: white; }

/* Content */
.topup-content {
    max-width: 1100px;
    margin: -2rem auto 3rem;
    padding: 0 1.5rem;
    position: relative;
    z-index: 1;
}

/* Error */
.error-banner {
    background: #fef2f2;
    border: 1px solid #fca5a5;
    color: #991b1b;
    padding: 0.875rem 1rem;
    border-radius: 0.75rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}
.error-close {
    background: none;
    border: none;
    color: #991b1b;
    cursor: pointer;
    font-size: 1rem;
    padding: 0.25rem;
    flex-shrink: 0;
}

/* Grid gói xu */
.packages-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

/* Card gói xu */
.package-card {
    background: white;
    border-radius: 1.25rem;
    padding: 2rem 1.5rem;
    text-align: center;
    border: 2px solid #e8eaf6;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);
    position: relative;
    transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.package-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px -8px rgba(79, 70, 229, 0.2);
    border-color: #818cf8;
}

/* Gói phổ biến */
.package-popular {
    border-color: #7c3aed;
    background: linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%);
    transform: scale(1.03);
}
.package-popular:hover {
    transform: scale(1.03) translateY(-6px);
}

.popular-badge {
    position: absolute;
    top: -0.8rem;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.3rem 1rem;
    border-radius: 999px;
    white-space: nowrap;
    box-shadow: 0 4px 8px rgba(124, 58, 237, 0.4);
}

.package-name {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e1b4b;
    margin: 0.25rem 0;
}

.package-coins {
    margin: 0.5rem 0;
}
.coins-main {
    font-size: 2.5rem;
    font-weight: 900;
    color: #4f46e5;
    line-height: 1;
}
.coins-label {
    font-size: 1rem;
    color: #6b7280;
    font-weight: 600;
}

.bonus-row { min-height: 1.6rem; }
.bonus-tag {
    background: #dcfce7;
    color: #166534;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
}
.bonus-empty { opacity: 0; }

.total-coins {
    font-size: 0.85rem;
    color: #6b7280;
}
.total-coins strong { color: #374151; }

.package-price {
    font-size: 1.4rem;
    font-weight: 800;
    color: #7c3aed;
    margin: 0.25rem 0;
}

.btn-topup {
    margin-top: 0.75rem;
    width: 100%;
    padding: 0.8rem;
    border-radius: 0.875rem;
    border: none;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.25s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}
.btn-topup:hover:not(:disabled) {
    background: linear-gradient(135deg, #4338ca, #6d28d9);
    box-shadow: 0 6px 16px rgba(79, 70, 229, 0.35);
    transform: translateY(-1px);
}
.btn-topup:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}
.btn-topup-popular {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}
.btn-spinner { animation: spin 1s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Skeleton */
.skeleton-card { animation: shimmer 1.5s ease-in-out infinite; }
@keyframes shimmer {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
.skeleton-title, .skeleton-coins, .skeleton-price, .skeleton-btn {
    background: #e5e7eb;
    border-radius: 0.5rem;
    margin: 0.5rem auto;
}
.skeleton-title { height: 1.2rem; width: 60%; }
.skeleton-coins { height: 3rem; width: 70%; }
.skeleton-price { height: 1.5rem; width: 50%; }
.skeleton-btn { height: 2.5rem; width: 100%; border-radius: 0.875rem; }

/* Hướng dẫn */
.guide-section {
    background: white;
    border-radius: 1.25rem;
    padding: 2rem;
    border: 1px solid #e8eaf6;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.guide-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1.25rem;
}
.guide-steps {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
}
.guide-step {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    color: #475569;
    font-size: 0.9rem;
    line-height: 1.5;
}
.step-num {
    flex-shrink: 0;
    width: 1.75rem;
    height: 1.75rem;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.8rem;
}

/* Responsive */
@media (max-width: 640px) {
    .topup-title { font-size: 1.8rem; }
    .packages-grid { grid-template-columns: 1fr 1fr; gap: 1rem; }
    .package-card { padding: 1.25rem 1rem; }
    .coins-main { font-size: 1.8rem; }
    .package-popular { transform: none; }
    .package-popular:hover { transform: translateY(-4px); }
}
</style>
