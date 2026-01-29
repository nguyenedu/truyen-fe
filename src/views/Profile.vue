<script setup>
import Navbar from '@/components/common/Navbar.vue';
import Avatar from 'primevue/avatar';
import Card from 'primevue/card';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <template #content>
          <div class="text-center mb-8">
            <Avatar
              :label="authStore.user?.username?.charAt(0).toUpperCase()"
              size="xlarge"
              shape="circle"
              class="bg-gradient-to-r from-sky-500 to-blue-600 text-white text-4xl mb-4"
            />
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {{ authStore.user?.username }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400">{{ authStore.user?.email }}</p>
          </div>
          
          <div class="space-y-4">
            <div class="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span class="font-semibold text-gray-700 dark:text-gray-300">Vai trò:</span>
              <span class="text-gray-600 dark:text-gray-400">{{ authStore.user?.role || 'USER' }}</span>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
