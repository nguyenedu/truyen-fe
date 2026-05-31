<script setup>
// Component Navbar - Thanh điều hướng chính với menu thể loại, tìm kiếm, và tài khoản
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useWalletStore } from '@/stores/wallet';
import { useTheme } from '@/composables/useTheme';
import { getCategories } from '@/api/category';
import { formatNumber } from '@/utils/formatters';
import SearchBox from '@/components/common/SearchBox.vue';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import Menu from 'primevue/menu';

const router = useRouter();
const authStore = useAuthStore();
const walletStore = useWalletStore();
const { isDark, toggleTheme } = useTheme();

const userMenu = ref();
const categories = ref([]);
const showCategoryDropdown = ref(false);
let hideTimeout = null;

// Menu dropdown cho người dùng đã đăng nhập
const userMenuItems = ref([
  {
    label: 'Trang cá nhân',
    icon: 'pi pi-user',
    command: () => router.push('/profile')
  },
  {
    label: 'Ví xu',
    icon: 'pi pi-wallet',
    command: () => router.push('/wallet')
  },
  {
    label: 'Nạp xu',
    icon: 'pi pi-plus-circle',
    command: () => router.push('/top-up')
  },
  {
    separator: true
  },
  {
    label: 'Đăng xuất',
    icon: 'pi pi-sign-out',
    command: handleLogout
  }
]);

// Tải danh sách thể loại cho dropdown khi component mount
onMounted(async () => {
  try {
    const response = await getCategories(0, 100);
    
    // Xử lý cấu trúc response từ backend (có thể là mảng hoặc phân trang)
    if (response.data && response.data.data) {
      if (Array.isArray(response.data.data)) {
        categories.value = response.data.data;
      } else if (response.data.data.content) {
        categories.value = response.data.data.content;
      }
    }
  } catch (error) {
    console.error('Lỗi khi tải danh sách thể loại:', error);
  }

  // Tải số dư ví nếu đã đăng nhập
  if (authStore.isAuthenticated) {
    walletStore.fetchWallet();
  }
});

async function handleLogout() {
  walletStore.reset();
  await authStore.logout();
  router.replace('/');
}

const toggleUserMenu = (event) => {
  userMenu.value.toggle(event);
};

// Dùng timeout để tránh dropdown đóng khi di chuột giữa nút và menu
const showCategories = () => {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
  showCategoryDropdown.value = true;
};

const hideCategories = () => {
  hideTimeout = setTimeout(() => {
    showCategoryDropdown.value = false;
  }, 200);
};

const navigateToCategory = (categoryId) => {
  router.push({ name: 'Browse', query: { category: categoryId } });
  showCategoryDropdown.value = false;
};
</script>

<template>
  <nav class="navbar-root">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2 group transition-all shrink-0">
          <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <i class="pi pi-book text-white text-xl"></i>
          </div>
          <span class="text-xl font-black ml-2 tracking-tighter hidden sm:inline navbar-logo-text">TRUYỆN <span class="text-indigo-600 dark:text-indigo-400">ONLINE</span></span>
        </router-link>

        <!-- Liên kết điều hướng -->
        <div class="flex items-center gap-1 ml-6 shrink-0">
          <!-- Dropdown thể loại -->
          <div 
            class="relative category-dropdown-container"
            @mouseenter="showCategories"
            @mouseleave="hideCategories"
          >
            <Button 
              label="Thể Loại" 
              icon="pi pi-angle-down" 
              iconPos="right"
              text 
              class="navbar-link-btn" 
            />
            
            <!-- Menu dropdown thể loại -->
            <Transition name="dropdown">
              <div 
                v-if="showCategoryDropdown && categories.length > 0"
                class="category-dropdown"
                @mouseenter="showCategories"
                @mouseleave="hideCategories"
              >
                <div class="category-grid">
                  <button
                    v-for="category in categories"
                    :key="category.id"
                    @click="navigateToCategory(category.id)"
                    class="category-item"
                  >
                    {{ category.name }}
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <router-link to="/browse">
            <Button label="Tìm kiếm" text class="navbar-link-btn" />
          </router-link>

          <template v-if="authStore.isAuthenticated">
            <router-link to="/favorites">
                <Button label="Yêu thích" text class="navbar-link-btn hidden md:inline-flex" />
            </router-link>
            
            <router-link to="/history">
                <Button label="Lịch sử" text class="navbar-link-btn hidden md:inline-flex" />
            </router-link>
          </template>
        </div>

        <!-- Ô tìm kiếm -->
        <div class="flex-1 max-w-md mx-6 hidden lg:block">
          <SearchBox />
        </div>

        <!-- Nút bên phải -->
        <div class="flex items-center gap-2 shrink-0">
          <!-- Dark Mode Toggle -->
          <button
            @click="toggleTheme"
            class="theme-toggle-btn"
            :title="isDark ? 'Chuyển sang sáng' : 'Chuyển sang tối'"
          >
            <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'"></i>
          </button>

          <template v-if="authStore.isAuthenticated">
            <!-- Coin balance -->
            <router-link to="/wallet" class="coin-balance-btn">
              <span class="coin-emoji">🪙</span>
              <span class="coin-count">{{ formatNumber(walletStore.balance) }}</span>
            </router-link>

            <!-- Menu người dùng -->
            <div @click="toggleUserMenu" class="cursor-pointer ml-2">
              <Avatar
                v-if="authStore.user?.avatar"
                :image="authStore.user.avatar"
                shape="circle"
                size="large"
                class="w-10! h-10! shadow-md hover:scale-110 transition-transform border-2 border-indigo-600 dark:border-indigo-400"
              />
              <Avatar
                v-else
                :label="authStore.user?.username?.charAt(0).toUpperCase()"
                shape="circle"
                size="large"
                class="w-10! h-10! bg-indigo-600! text-white! shadow-md hover:scale-110 transition-transform"
              />
            </div>
            <Menu ref="userMenu" :model="userMenuItems" popup class="user-dropdown-menu" />
          </template>

          <template v-else>
            <div class="flex items-center gap-3 ml-4">
                <router-link to="/login">
                  <Button label="Đăng nhập" text class="navbar-link-btn" />
                </router-link>
                <router-link to="/register">
                  <Button label="Đăng ký" class="bg-indigo-600! hover:bg-indigo-700! border-0 shadow-md px-6 rounded-xl font-bold" />
                </router-link>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
/* ===== Navbar Root ===== */
.navbar-root {
    background-color: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid #e2e8f0;
    position: sticky;
    top: 0;
    z-index: 50;
}

.dark .navbar-root {
    background-color: #1e293b;
    border-bottom-color: #334155;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

/* ===== Logo Text ===== */
.navbar-logo-text {
    color: #0f172a;
}

.dark .navbar-logo-text {
    color: #f1f5f9;
}

/* ===== Nav Link Buttons ===== */
.navbar-link-btn {
    color: #475569 !important;
    font-weight: 600 !important;
    padding-left: 0.75rem !important;
    padding-right: 0.75rem !important;
}

.navbar-link-btn:hover {
    color: #4f46e5 !important;
}

.dark .navbar-link-btn {
    color: #cbd5e1 !important;
}

.dark .navbar-link-btn:hover {
    color: #818cf8 !important;
}

/* ===== Theme Toggle Button ===== */
.theme-toggle-btn {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 2px solid #e2e8f0;
    background: #f8fafc;
    color: #475569;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-toggle-btn:hover {
    background: #eef2ff;
    border-color: #818cf8;
    color: #4f46e5;
    transform: rotate(15deg) scale(1.1);
}

.dark .theme-toggle-btn {
    border-color: #475569;
    background: #334155;
    color: #fbbf24;
}

.dark .theme-toggle-btn:hover {
    background: #475569;
    border-color: #fbbf24;
    color: #f59e0b;
    transform: rotate(15deg) scale(1.1);
}

/* ===== Dropdown thể loại ===== */
.category-dropdown-container {
    position: relative;
}

.category-dropdown {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 0.5rem;
    background-color: #ffffff;
    border: 1px solid rgba(79, 70, 229, 0.1);
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    min-width: 600px;
    max-width: 800px;
    z-index: 1000;
}

.dark .category-dropdown {
    background-color: #1e293b;
    border-color: #334155;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
}

.category-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
}

.category-item {
    padding: 0.75rem 1rem;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    color: #475569;
    font-weight: 500;
    font-size: 0.875rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.category-item:hover {
    background-color: #eef2ff;
    border-color: #818cf8;
    color: #4f46e5;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.dark .category-item {
    background-color: #334155;
    border-color: #475569;
    color: #cbd5e1;
}

.dark .category-item:hover {
    background-color: #475569;
    border-color: #818cf8;
    color: #a5b4fc;
}

/* Hiệu ứng chuyển đổi dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
}

.dropdown-enter-to,
.dropdown-leave-from {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

/* Responsive */
@media (max-width: 768px) {
    .category-dropdown {
        min-width: 90vw;
        left: 0;
        transform: translateX(0);
        margin-left: -1rem;
    }
    
    .category-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* ===== Menu dropdown người dùng ===== */
.p-menu.user-dropdown-menu {
    background-color: #ffffff !important;
    border: 1px solid rgba(79, 70, 229, 0.1) !important;
    border-radius: 1rem !important;
    padding: 0.5rem !important;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
    min-width: 180px !important;
    overflow: hidden !important;
    transform: translateX(-130px) !important;
    margin-top: 0.75rem !important;
}

.dark .p-menu.user-dropdown-menu {
    background-color: #1e293b !important;
    border-color: #334155 !important;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4) !important;
}

.user-dropdown-menu .p-menuitem-link {
    padding: 0.75rem 1rem !important;
    background-color: transparent !important;
    transition: all 0.2s ease !important;
    border-radius: 0.5rem !important;
    margin: 0.1rem 0 !important;
}

.user-dropdown-menu .p-menuitem-link:hover {
    background-color: #f5f3ff !important;
}

.dark .user-dropdown-menu .p-menuitem-link:hover {
    background-color: #334155 !important;
}

.user-dropdown-menu .p-menuitem-text {
    color: #4b5563 !important;
    font-weight: 600 !important;
    font-size: 0.9rem !important;
}

.dark .user-dropdown-menu .p-menuitem-text {
    color: #cbd5e1 !important;
}

.user-dropdown-menu .p-menuitem-icon {
    color: #6366f1 !important;
    font-size: 1.1rem !important;
    margin-right: 0.75rem !important;
}

.dark .user-dropdown-menu .p-menuitem-icon {
    color: #818cf8 !important;
}

.user-dropdown-menu .p-menuitem-link:hover .p-menuitem-text {
    color: #4f46e5 !important;
}

.dark .user-dropdown-menu .p-menuitem-link:hover .p-menuitem-text {
    color: #a5b4fc !important;
}

.user-dropdown-menu .p-menuitem-link:hover .p-menuitem-icon {
    color: #4338ca !important;
}

.user-dropdown-menu .p-divider {
    border-top: 1px solid #f3f4f6 !important;
    margin: 0.4rem 0 !important;
}

.dark .user-dropdown-menu .p-divider {
    border-top-color: #334155 !important;
}
</style>

<style scoped>
:deep(.p-inputtext) {
    padding: 0.75rem 1rem !important;
}

/* Nút hiển thị số dư xu trên navbar */
.coin-balance-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    background: linear-gradient(135deg, #f5f3ff, #ede9fe);
    border: 1px solid #c4b5fd;
    color: #5b21b6;
    padding: 0.4rem 0.875rem;
    border-radius: 999px;
    font-weight: 700;
    font-size: 0.875rem;
    text-decoration: none;
    transition: all 0.2s ease;
    white-space: nowrap;
}
.coin-balance-btn:hover {
    background: linear-gradient(135deg, #ede9fe, #ddd6fe);
    border-color: #a78bfa;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(124, 58, 237, 0.2);
}

.dark .coin-balance-btn {
    background: linear-gradient(135deg, #312e81, #3730a3);
    border-color: #6366f1;
    color: #c4b5fd;
}

.dark .coin-balance-btn:hover {
    background: linear-gradient(135deg, #3730a3, #4338ca);
    border-color: #818cf8;
}

.coin-emoji { font-size: 1rem; }
.coin-count { line-height: 1; }
</style>
