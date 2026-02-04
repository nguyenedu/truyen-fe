<script setup>
import { watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import Toast from 'primevue/toast';
import LoadingOverlay from '@/components/common/LoadingOverlay.vue';

const route = useRoute();


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
