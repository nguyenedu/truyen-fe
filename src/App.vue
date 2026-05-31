<script setup>
// Component gốc - Quản lý theme toàn cục và hiển thị layout chính
import { RouterView } from 'vue-router';
import Toast from 'primevue/toast';
import LoadingOverlay from '@/components/common/LoadingOverlay.vue';
import { useTheme } from '@/composables/useTheme';

// Khởi tạo theme toàn cục (đọc từ localStorage hoặc preference hệ thống)
const { isDark } = useTheme();
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
