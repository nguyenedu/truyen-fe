<script setup>
import { RouterView } from 'vue-router';
import Toast from 'primevue/toast';
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
