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
  router.push({ name: 'Login' });
}

const toggleUserMenu = (event) => {
  userMenu.value.toggle(event);
};
</script>

<template>
  <nav class="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
          <span class="text-2xl">📚</span>
          <span class="text-xl font-bold hidden sm:inline">Truyện Online</span>
        </router-link>

        <!-- Search Bar -->
        <div class="flex-1 max-w-md mx-4">
          <div class="relative">
            <InputText
              v-model="searchKeyword"
              @keyup.enter="handleSearch"
              placeholder="Tìm kiếm truyện..."
              class="w-full !pr-10"
            />
            <Button
              @click="handleSearch"
              icon="pi pi-search"
              text
              rounded
              class="!absolute !right-1 !top-1/2 !-translate-y-1/2 !text-gray-500"
            />
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="flex items-center gap-2">
          <router-link to="/">
            <Button label="Trang chủ" text class="text-white hover:bg-white/10" />
          </router-link>
          
          <router-link to="/browse">
            <Button label="Khám phá" text class="text-white hover:bg-white/10" />
          </router-link>
          
          <template v-if="authStore.isAuthenticated">
            <router-link to="/favorites">
              <Button label="Yêu thích" text class="text-white hover:bg-white/10 hidden sm:inline-flex" />
            </router-link>
            <router-link to="/history">
              <Button label="Lịch sử" text class="text-white hover:bg-white/10 hidden sm:inline-flex" />
            </router-link>
            
            <!-- User Menu -->
            <Button
              type="button"
              @click="toggleUserMenu"
              class="!bg-white/20 hover:!bg-white/30 !border-0"
              rounded
            >
              <span class="font-semibold text-white">
                {{ authStore.user?.username?.charAt(0).toUpperCase() }}
              </span>
            </Button>
            <Menu ref="userMenu" :model="userMenuItems" popup />
          </template>
          
          <template v-else>
            <router-link to="/login">
              <Button label="Đăng nhập" outlined class="!text-white !border-white hover:!bg-white/10" />
            </router-link>
            <router-link to="/register">
              <Button label="Đăng ký" class="!bg-white !text-indigo-600 hover:!bg-gray-100" />
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Custom styles for PrimeVue components in navbar */
</style>
