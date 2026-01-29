<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/common/Navbar.vue';
import StoryCard from '@/components/common/StoryCard.vue';
import ProgressSpinner from 'primevue/progressspinner';
import { storyAPI } from '@/api/story';
import { categoryAPI } from '@/api/category';

const route = useRoute();
const stories = ref([]);
const category = ref(null);
const loading = ref(true);

onMounted(async () => {
  const categoryId = route.params.id;
  
  try {
    loading.value = true;
    const [storiesRes, categoryRes] = await Promise.all([
      storyAPI.getStoriesByCategory(categoryId),
      categoryAPI.getCategoryById(categoryId),
    ]);
    
    stories.value = storiesRes.data.data.content;
    category.value = categoryRes.data.data;
  } catch (error) {
    console.error('Error loading category:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="category" class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ category.name }}</h1>
        <p v-if="category.description" class="text-gray-600 dark:text-gray-400">{{ category.description }}</p>
      </div>
      
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <ProgressSpinner />
        <p class="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
      </div>
      
      <div v-else-if="stories.length === 0" class="text-center py-20">
        <i class="pi pi-inbox text-6xl text-gray-400 mb-4"></i>
        <p class="text-gray-600 dark:text-gray-400">Chưa có truyện nào trong thể loại này</p>
      </div>
      
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StoryCard
          v-for="story in stories"
          :key="story.id"
          :story="story"
        />
      </div>
    </div>
  </div>
</template>
