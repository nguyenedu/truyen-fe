<script setup>
// Component gốc - Quản lý theme theo route và hiển thị layout chính
import { watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import Toast from 'primevue/toast';
import LoadingOverlay from '@/components/common/LoadingOverlay.vue';

const route = useRoute();

// Tắt dark mode khi rời trang đọc chương (chỉ trang đọc mới dùng dark mode)
watch(() => route.path, () => {
  if (!route.path.includes('/chapter/')) {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  } else {
    document.documentElement.style.colorScheme = '';
  }
}, { immediate: true });
</script>

<template>
  <div id="app">
    <Toast />
    <LoadingOverlay />
    <RouterView />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
}
</style>
