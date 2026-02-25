<script setup>
// Component Navbar - Thanh điều hướng chính với menu thể loại, tìm kiếm, và tài khoản
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getCategories } from '@/api/category';
import SearchBox from '@/components/common/SearchBox.vue';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import Menu from 'primevue/menu';

const router = useRouter();
const authStore = useAuthStore();

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
});

async function handleLogout() {
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
  <nav class="!bg-white shadow-md border-b border-slate-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2 group transition-all shrink-0">
          <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <i class="pi pi-book text-white text-xl"></i>
          </div>
          <span class="text-xl font-black !text-slate-900 ml-2 tracking-tighter hidden sm:inline">TRUYỆN <span class="text-indigo-600">ONLINE</span></span>
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
              class="!text-slate-600 hover:!text-indigo-600 !px-3 font-semibold" 
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
            <Button label="Tìm kiếm" text class="!text-slate-600 hover:!text-indigo-600 !px-3 font-semibold" />
          </router-link>

          <template v-if="authStore.isAuthenticated">
            <router-link to="/favorites">
                <Button label="Yêu thích" text class="!text-slate-600 hover:!text-indigo-600 !px-3 font-semibold hidden md:inline-flex" />
            </router-link>
            
            <router-link to="/history">
                <Button label="Lịch sử" text class="!text-slate-600 hover:!text-indigo-600 !px-3 font-semibold hidden md:inline-flex" />
            </router-link>
          </template>
        </div>

        <!-- Ô tìm kiếm -->
        <div class="flex-1 max-w-md mx-6 hidden lg:block">
          <SearchBox />
        </div>

        <!-- Nút bên phải -->
        <div class="flex items-center gap-2 shrink-0">
          <template v-if="authStore.isAuthenticated">
            <!-- Menu người dùng -->
            <div @click="toggleUserMenu" class="cursor-pointer ml-4">
              <Avatar
                v-if="authStore.user?.avatar"
                :image="authStore.user.avatar"
                shape="circle"
                size="large"
                class="!w-10 !h-10 shadow-md hover:scale-110 transition-transform border-2 border-indigo-600"
              />
              <Avatar
                v-else
                :label="authStore.user?.username?.charAt(0).toUpperCase()"
                shape="circle"
                size="large"
                class="!w-10 !h-10 !bg-indigo-600 !text-white shadow-md hover:scale-110 transition-transform"
              />
            </div>
            <Menu ref="userMenu" :model="userMenuItems" popup class="user-dropdown-menu" />
          </template>

          <template v-else>
            <div class="flex items-center gap-3 ml-4">
                <router-link to="/login">
                  <Button label="Đăng nhập" text class="!text-slate-600 hover:!text-indigo-600 font-semibold" />
                </router-link>
                <router-link to="/register">
                  <Button label="Đăng ký" class="!bg-indigo-600 hover:!bg-indigo-700 border-0 shadow-md px-6 rounded-xl font-bold" />
                </router-link>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
/* Dropdown thể loại */
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

/* Menu dropdown người dùng */
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

.user-dropdown-menu .p-menuitem-text {
    color: #4b5563 !important;
    font-weight: 600 !important;
    font-size: 0.9rem !important;
}

.user-dropdown-menu .p-menuitem-icon {
    color: #6366f1 !important;
    font-size: 1.1rem !important;
    margin-right: 0.75rem !important;
}

.user-dropdown-menu .p-menuitem-link:hover .p-menuitem-text {
    color: #4f46e5 !important;
}

.user-dropdown-menu .p-menuitem-link:hover .p-menuitem-icon {
    color: #4338ca !important;
}

.user-dropdown-menu .p-divider {
    border-top: 1px solid #f3f4f6 !important;
    margin: 0.4rem 0 !important;
}
</style>

<style scoped>
nav {
    background-color: #ffffff !important;
}

:deep(.p-inputtext) {
    padding: 0.75rem 1rem !important;
}
</style>
