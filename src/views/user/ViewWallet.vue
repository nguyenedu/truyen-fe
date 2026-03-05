<script setup>
// Trang ví cá nhân - Số dư, lịch sử giao dịch, và lịch sử đơn hàng
import { ref, onMounted } from 'vue';
import { useWalletStore } from '@/stores/wallet';
import { getMyOrders } from '@/api/payment';
import { formatNumber, formatRelativeDate } from '@/utils/formatters';
import { formatCurrency, formatCoinAmount, getPaymentStatusLabel, getPaymentStatusSeverity, getTransactionTypeLabel, TRANSACTION_TYPE } from '@/utils/payment';

const walletStore = useWalletStore();

const activeTab = ref('balance');

// Orders tab state
const orders = ref([]);
const orderMeta = ref({ page: 0, totalPages: 0 });
const loadingOrders = ref(false);

onMounted(async () => {
    await Promise.allSettled([
        walletStore.fetchWallet(),
        walletStore.fetchTransactions(0, 10),
    ]);
});

// --- Tab Lịch sử giao dịch ---
const changeTxPage = async (page) => {
    await walletStore.fetchTransactions(page, 10);
};

// --- Tab Lịch sử nạp tiền ---
const loadOrders = async (page = 0) => {
    loadingOrders.value = true;
    try {
        const response = await getMyOrders(page, 10);
        const data = response.data.data;
        orders.value = data.content ?? [];
        orderMeta.value = { page: data.number, totalPages: data.totalPages };
    } catch (err) {
        console.error('Lỗi tải đơn hàng:', err);
    } finally {
        loadingOrders.value = false;
    }
};

const onTabChange = (tab) => {
    activeTab.value = tab;
    if (tab === 'orders' && orders.value.length === 0) {
        loadOrders(0);
    }
};
</script>

<template>
    <div class="wallet-page">
        <!-- Header -->
        <div class="wallet-header">
            <div class="wallet-header-inner">
                <router-link to="/" class="btn-back-home">
                    ← Trang chủ
                </router-link>
                <h1 class="wallet-title">🪙 Ví Xu Của Tôi</h1>

                <!-- Balance card -->
                <div class="balance-card">
                    <div class="balance-info">
                        <span class="balance-label">Số dư hiện tại</span>
                        <span class="balance-amount">{{ formatNumber(walletStore.balance) }}</span>
                        <span class="balance-unit">xu</span>
                    </div>
                    <router-link to="/top-up" class="btn-topup-link">
                        ⚡ Nạp xu
                    </router-link>
                </div>
            </div>
        </div>

        <div class="wallet-content">
            <!-- Tabs -->
            <div class="tab-bar">
                <button
                    class="tab-btn"
                    :class="{ active: activeTab === 'balance' }"
                    @click="onTabChange('balance')"
                >
                    📊 Lịch sử giao dịch
                </button>
                <button
                    class="tab-btn"
                    :class="{ active: activeTab === 'orders' }"
                    @click="onTabChange('orders')"
                >
                    🧾 Lịch sử nạp tiền
                </button>
            </div>

            <!-- Tab: Lịch sử giao dịch -->
            <div v-if="activeTab === 'balance'">
                <div v-if="walletStore.loading" class="loading-state">
                    <div class="mini-spinner"></div>
                    <span>Đang tải...</span>
                </div>

                <div v-else-if="walletStore.transactions.length === 0" class="empty-state">
                    <span class="empty-icon">📭</span>
                    <p>Chưa có giao dịch nào</p>
                    <router-link to="/top-up" class="link-topup">Nạp xu ngay →</router-link>
                </div>

                <div v-else>
                    <div class="tx-list">
                        <div
                            v-for="tx in walletStore.transactions"
                            :key="tx.id"
                            class="tx-row"
                        >
                            <div class="tx-icon" :class="tx.type === TRANSACTION_TYPE.DEPOSIT || tx.type === TRANSACTION_TYPE.BONUS ? 'tx-credit' : 'tx-debit'">
                                {{ tx.type === TRANSACTION_TYPE.DEPOSIT || tx.type === TRANSACTION_TYPE.BONUS ? '⬆️' : '⬇️' }}
                            </div>
                            <div class="tx-info">
                                <span class="tx-desc">{{ tx.description }}</span>
                                <span class="tx-time">{{ formatRelativeDate(tx.createdAt) }}</span>
                            </div>
                            <div class="tx-right">
                                <span class="tx-amount" :class="tx.type === TRANSACTION_TYPE.DEPOSIT || tx.type === TRANSACTION_TYPE.BONUS ? 'amount-credit' : 'amount-debit'">
                                    {{ formatCoinAmount(tx.amount, tx.type) }}
                                </span>
                                <span class="tx-balance">Còn: {{ formatNumber(tx.balanceAfter) }} xu</span>
                            </div>
                        </div>
                    </div>

                    <!-- Phân trang giao dịch -->
                    <div v-if="walletStore.transactionMeta.totalPages > 1" class="pagination">
                        <button
                            v-for="p in walletStore.transactionMeta.totalPages"
                            :key="p"
                            class="page-btn"
                            :class="{ active: walletStore.transactionMeta.page === p - 1 }"
                            @click="changeTxPage(p - 1)"
                        >
                            {{ p }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Tab: Lịch sử nạp tiền -->
            <div v-if="activeTab === 'orders'">
                <div v-if="loadingOrders" class="loading-state">
                    <div class="mini-spinner"></div>
                    <span>Đang tải...</span>
                </div>

                <div v-else-if="orders.length === 0" class="empty-state">
                    <span class="empty-icon">🧾</span>
                    <p>Chưa có lịch sử nạp tiền</p>
                    <router-link to="/top-up" class="link-topup">Nạp xu ngay →</router-link>
                </div>

                <div v-else>
                    <div class="orders-list">
                        <div v-for="order in orders" :key="order.id" class="order-row">
                            <div class="order-left">
                                <span class="order-pkg">{{ order.packageName }}</span>
                                <span class="order-code">{{ order.orderCode }}</span>
                            </div>
                            <div class="order-center">
                                <span class="order-coins">+{{ formatNumber(order.coinsToAdd) }} xu</span>
                                <span class="order-time">{{ formatRelativeDate(order.createdAt) }}</span>
                            </div>
                            <div class="order-right">
                                <span class="order-amount">{{ formatCurrency(order.amount) }}</span>
                                <span
                                    class="order-status"
                                    :class="`status-${getPaymentStatusSeverity(order.status)}`"
                                >
                                    {{ getPaymentStatusLabel(order.status) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Phân trang orders -->
                    <div v-if="orderMeta.totalPages > 1" class="pagination">
                        <button
                            v-for="p in orderMeta.totalPages"
                            :key="p"
                            class="page-btn"
                            :class="{ active: orderMeta.page === p - 1 }"
                            @click="loadOrders(p - 1)"
                        >
                            {{ p }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.wallet-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%);
}

/* Header */
.wallet-header {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    padding: 2.5rem 1.5rem 4rem;
    text-align: center;
}
.wallet-header-inner { max-width: 700px; margin: 0 auto; }
.btn-back-home {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: rgba(255,255,255,0.75);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 1rem;
    transition: color 0.2s;
}
.btn-back-home:hover { color: white; }
.wallet-title {
    font-size: 2rem;
    font-weight: 900;
    color: white;
    margin-bottom: 1.5rem;
}

/* Balance card */
.balance-card {
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 1.5rem;
    padding: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
}
.balance-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    color: white;
}
.balance-label { font-size: 0.85rem; opacity: 0.8; }
.balance-amount { font-size: 3rem; font-weight: 900; line-height: 1; }
.balance-unit { font-size: 1rem; opacity: 0.8; margin-top: -0.25rem; }

.btn-topup-link {
    background: white;
    color: #4f46e5;
    font-weight: 700;
    font-size: 1rem;
    padding: 0.875rem 1.75rem;
    border-radius: 1rem;
    text-decoration: none;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    white-space: nowrap;
}
.btn-topup-link:hover {
    background: #f5f3ff;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

/* Content */
.wallet-content {
    max-width: 800px;
    margin: -2rem auto 3rem;
    padding: 0 1.5rem;
    position: relative;
    z-index: 1;
}

/* Tabs */
.tab-bar {
    background: white;
    border-radius: 1.25rem 1.25rem 0 0;
    display: flex;
    border-bottom: 2px solid #f1f5f9;
    overflow: hidden;
}
.tab-btn {
    flex: 1;
    padding: 1rem;
    border: none;
    background: none;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    color: #64748b;
    transition: all 0.2s;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
}
.tab-btn:hover { color: #4f46e5; background: #f8f9ff; }
.tab-btn.active {
    color: #4f46e5;
    border-bottom-color: #4f46e5;
    background: white;
}

/* Nội dung tab (chung) */
.wallet-content > div:not(.tab-bar) {
    background: white;
    border-radius: 0 0 1.25rem 1.25rem;
    padding: 1.5rem;
    min-height: 200px;
    box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.1);
}

/* Loading */
.loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 3rem;
    color: #94a3b8;
}
.mini-spinner {
    width: 1.5rem;
    height: 1.5rem;
    border: 3px solid #e2e8f0;
    border-top-color: #4f46e5;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Empty */
.empty-state {
    text-align: center;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
}
.empty-icon { font-size: 3rem; }
.empty-state p { color: #94a3b8; font-size: 0.95rem; }
.link-topup {
    color: #4f46e5;
    font-weight: 600;
    text-decoration: none;
}
.link-topup:hover { text-decoration: underline; }

/* Danh sách giao dịch */
.tx-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.tx-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.875rem;
    border-radius: 0.875rem;
    transition: background 0.15s;
}
.tx-row:hover { background: #f8f9ff; }

.tx-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
}
.tx-credit { background: #dcfce7; }
.tx-debit { background: #fee2e2; }

.tx-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}
.tx-desc {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.tx-time { font-size: 0.75rem; color: #94a3b8; }

.tx-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.2rem;
}
.tx-amount { font-weight: 700; font-size: 0.95rem; }
.amount-credit { color: #059669; }
.amount-debit { color: #dc2626; }
.tx-balance { font-size: 0.72rem; color: #94a3b8; }

/* Danh sách đơn hàng */
.orders-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.order-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.875rem;
    border-radius: 0.875rem;
    border: 1px solid #f1f5f9;
    transition: background 0.15s;
}
.order-row:hover { background: #f8f9ff; }

.order-left, .order-center, .order-right {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}
.order-left { flex: 1; min-width: 0; }
.order-right { align-items: flex-end; flex-shrink: 0; }

.order-pkg { font-weight: 700; font-size: 0.9rem; color: #1e293b; }
.order-code { font-size: 0.72rem; color: #94a3b8; font-family: monospace; }
.order-coins { font-weight: 700; color: #059669; font-size: 0.95rem; }
.order-time { font-size: 0.72rem; color: #94a3b8; }
.order-amount { font-weight: 700; color: #4f46e5; font-size: 0.9rem; }

/* Status badges */
.order-status {
    font-size: 0.72rem;
    font-weight: 700;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
}
.status-success { background: #dcfce7; color: #166534; }
.status-warn { background: #fef9c3; color: #854d0e; }
.status-danger { background: #fee2e2; color: #991b1b; }
.status-secondary { background: #f1f5f9; color: #64748b; }

/* Phân trang */
.pagination {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1.25rem;
    flex-wrap: wrap;
}
.page-btn {
    min-width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
    background: white;
    color: #475569;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.15s;
}
.page-btn:hover { border-color: #818cf8; color: #4f46e5; }
.page-btn.active { background: #4f46e5; color: white; border-color: #4f46e5; }

@media (max-width: 580px) {
    .balance-card { flex-direction: column; align-items: center; text-align: center; }
    .balance-info { align-items: center; }
    .order-center { display: none; }
}
</style>
