<script setup>
import { watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import Toast from 'primevue/toast';

const route = useRoute();

// Global guard to ensure system-wide dark mode doesn't bleed into our light theme
watch(() => route.path, () => {
  if (!route.path.includes('/chapter/')) {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    // Force light scheme for PrimeVue and Tailwind
    document.documentElement.style.colorScheme = 'light';
  } else {
    // Let the chapter view handle it
    document.documentElement.style.colorScheme = '';
  }
}, { immediate: true });
</script>

<template>
  <div id="app">
    <Toast />
    <RouterView />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
}
</style>
