<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Menu from 'primevue/menu';

const router = useRouter();
const authStore = useAuthStore();

const searchKeyword = ref('');
const userMenu = ref();

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

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({ name: 'Search', query: { q: searchKeyword.value } });
  }
};

async function handleLogout() {
  await authStore.logout();
  router.replace('/');
}

const toggleUserMenu = (event) => {
  userMenu.value.toggle(event);
};
</script>

<template>
  <nav class="bg-gray-900 shadow-md border-b border-white/5 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2 group transition-all shrink-0">
          <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <i class="pi pi-book text-white text-xl"></i>
          </div>
          <span class="text-xl font-black text-white ml-2 tracking-tighter hidden sm:inline">TRUYỆN <span class="text-indigo-400">ONLINE</span></span>
        </router-link>

        <!-- Navigation Links (Left-aligned) -->
        <div class="flex items-center gap-1 ml-6 shrink-0">
          <router-link to="/browse">
            <Button label="Khám phá" text class="!text-gray-300 hover:!text-white !px-3 font-semibold" />
          </router-link>

          <template v-if="authStore.isAuthenticated">
            <router-link to="/favorites">
                <Button label="Yêu thích" text class="!text-gray-300 hover:!text-white !px-3 font-semibold hidden md:inline-flex" />
            </router-link>
            
            <router-link to="/history">
                <Button label="Lịch sử" text class="!text-gray-300 hover:!text-white !px-3 font-semibold hidden md:inline-flex" />
            </router-link>
          </template>
        </div>

        <!-- Search Bar (Flexible Space) -->
        <div class="flex-1 max-w-md mx-6 hidden lg:block">
          <div class="relative group">
            <InputText
                v-model="searchKeyword"
                @keyup.enter="handleSearch"
                placeholder="Tìm kiếm truyện..."
                class="w-full !pl-10 !bg-white/5 !border-white/10 !text-white focus:!bg-white/10 focus:!border-indigo-500/50 rounded-2xl transition-all"
            />
            <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        <!-- Right Side Actions -->
        <div class="flex items-center gap-2 shrink-0">
          <template v-if="authStore.isAuthenticated">
            <!-- User Menu -->
            <Button
                type="button"
                @click="toggleUserMenu"
                class="!bg-indigo-600 hover:!bg-indigo-50 !border-0 ml-4 shadow-lg !w-10 !h-10 p-0 overflow-hidden group transition-all"
                rounded
            >
              <span class="font-black text-white group-hover:text-indigo-600 transition-colors">
                {{ authStore.user?.username?.charAt(0).toUpperCase() }}
              </span>
            </Button>
            <Menu ref="userMenu" :model="userMenuItems" popup class="user-dropdown-menu" />
          </template>

          <template v-else>
            <div class="flex items-center gap-3 ml-4">
                <router-link to="/login">
                  <Button label="Đăng nhập" text class="!text-gray-300 hover:!text-white font-semibold" />
                </router-link>
                <router-link to="/register">
                  <Button label="Đăng ký" class="!bg-indigo-600 hover:!bg-indigo-500 border-0 shadow-lg px-6 rounded-xl font-bold" />
                </router-link>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
/* Global styles for the user dropdown because it's portaled out of the component */
.p-menu.user-dropdown-menu {
    background-color: #0f172a !important; /* Very dark navy (slate-950) */
    border: 1px solid rgba(129, 140, 248, 0.2) !important;
    border-radius: 0.75rem !important;
    padding: 0.3rem !important;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5) !important;
    min-width: 150px !important;
    overflow: hidden !important;
    transform: translateX(-110px) !important;
    margin-top: 0.75rem !important;
}

.user-dropdown-menu .p-menuitem-link {
    padding: 0.75rem 1rem !important;
    background-color: transparent !important; /* Force transparent background */
    transition: all 0.2s ease !important;
}

.user-dropdown-menu .p-menuitem-link:hover {
    background-color: rgba(99, 102, 241, 0.15) !important; /* Subtle indigo hover */
}

/* Ensure text is always bright and visible */
.user-dropdown-menu .p-menuitem-text {
    color: #e2e8f0 !important; /* slate-200 */
    font-weight: 700 !important;
    font-size: 0.875rem !important;
}

.user-dropdown-menu .p-menuitem-icon {
    color: #818cf8 !important; /* indigo-400 */
    font-size: 1.1rem !important;
    margin-right: 0.75rem !important;
}

/* Hover/Focus states */
.user-dropdown-menu .p-menuitem-link:hover .p-menuitem-text,
.user-dropdown-menu .p-menuitem-link:focus .p-menuitem-text {
    color: #ffffff !important;
}

.user-dropdown-menu .p-menuitem-link:hover .p-menuitem-icon,
.user-dropdown-menu .p-menuitem-link:focus .p-menuitem-icon {
    color: #a5b4fc !important; /* indigo-300 */
}

.user-dropdown-menu .p-divider {
    border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
    margin: 0.4rem 0 !important;
}
</style>

<style scoped>
:deep(.p-inputtext) {
    padding: 0.75rem 1rem !important;
}
</style>
