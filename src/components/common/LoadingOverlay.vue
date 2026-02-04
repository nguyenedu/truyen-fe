<script setup>
import { useUIStore } from '@/stores/ui';
import ProgressSpinner from 'primevue/progressspinner';

const uiStore = useUIStore();
</script>

<template>
  <div 
    v-if="uiStore.loading" 
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300"
  >
    <div class="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
      <ProgressSpinner 
        strokeWidth="4" 
        animationDuration=".5s"
        aria-label="Loading"
        class="!w-16 !h-16"
      />
      <p class="text-slate-600 font-bold tracking-tight">Đang xử lý...</p>
    </div>
  </div>
</template>

<style scoped>
.animate-in {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes zoom-in {
  from { transform: scale(0.95); }
  to { transform: scale(1); }
}
.fade-in { animation-name: fade-in; }
.zoom-in { animation-name: zoom-in; }
</style>
