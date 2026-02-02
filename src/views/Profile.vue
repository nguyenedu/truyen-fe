<script setup>
import { computed } from 'vue';
import Navbar from '@/components/common/Navbar.vue';
import Avatar from 'primevue/avatar';
import Card from 'primevue/card';
import Button from 'primevue/button';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// Use computed to ensure reactivity
const user = computed(() => authStore.user);
const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card v-if="user">
        <template #content>
          <div class="text-center mb-8">
            <Avatar
              :label="user?.username?.charAt(0).toUpperCase()"
              size="xlarge"
              shape="circle"
              class="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-4xl mb-4"
            />
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {{ user?.username }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400">{{ user?.email }}</p>
          </div>
          
          <div class="space-y-4">
            <div class="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span class="font-semibold text-gray-700 dark:text-gray-300">Tên đăng nhập:</span>
              <span class="text-gray-600 dark:text-gray-400">{{ user?.username }}</span>
            </div>
            
            <div class="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span class="font-semibold text-gray-700 dark:text-gray-300">Email:</span>
              <span class="text-gray-600 dark:text-gray-400">{{ user?.email || 'Chưa cập nhật' }}</span>
            </div>
            
            <div class="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span class="font-semibold text-gray-700 dark:text-gray-300">Vai trò:</span>
              <span class="text-gray-600 dark:text-gray-400">{{ user?.role || 'USER' }}</span>
            </div>
          </div>
        </template>
      </Card>
      
      <!-- If no user data -->
      <Card v-else>
        <template #content>
          <div class="text-center py-8">
            <p class="text-gray-600 dark:text-gray-400 mb-4">Chưa đăng nhập</p>
            <Button label="Đăng nhập" @click="router.push('/login')" />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
