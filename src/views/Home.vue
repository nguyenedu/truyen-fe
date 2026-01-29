<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/common/Navbar.vue';
import StoryCard from '@/components/common/StoryCard.vue';
import Chip from 'primevue/chip';
import ProgressSpinner from 'primevue/progressspinner';
import { getStories } from '@/api/story';
import { getCategories } from '@/api/category';

const stories = ref([]);
const categories = ref([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    loading.value = true;
    
    const [storiesRes, categoryRes] = await Promise.all([
      getStories(0, 24), // Lấy 24 truyện
      getCategories(0, 20),
    ]);

    // Safe check for response data
    stories.value = storiesRes?.data?.data?.content || [];
    categories.value = categoryRes?.data?.data?.content || [];
  } catch (err) {
    console.error('Error loading home data:', err);
    error.value = 'Không thể tải dữ liệu. Vui lòng thử lại sau.';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Hero Section -->
      <section class="bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-600 rounded-2xl p-12 mb-12 text-center text-white shadow-xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Chào mừng đến với Truyện Online</h1>
        <p class="text-xl opacity-90">Khám phá hàng ngàn truyện hay, cập nhật mỗi ngày</p>
      </section>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <ProgressSpinner />
        <p class="mt-4 text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
      </div>

      <!-- Content -->
      <template v-else>
        <!-- Categories -->
        <section v-if="categories.length" class="mb-12">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Thể loại</h2>
          <div class="flex flex-wrap gap-3">
            <router-link
              v-for="category in categories"
              :key="category.id"
              :to="`/category/${category.id}`"
            >
              <Chip 
                :label="category.name" 
                class="cursor-pointer hover:bg-sky-100 dark:hover:bg-sky-900 transition-colors"
              />
            </router-link>
          </div>
        </section>

        <!-- All Stories -->
        <section v-if="stories.length" class="mb-12">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            <i class="pi pi-book text-sky-500"></i>
            Danh sách truyện
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <StoryCard
              v-for="story in stories"
              :key="story.id"
              :story="story"
            />
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* TailwindCSS handles all styling */
</style>
