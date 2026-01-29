<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/common/Navbar.vue';
import StoryCard from '@/components/common/StoryCard.vue';
import ProgressSpinner from 'primevue/progressspinner';
import { storyAPI } from '@/api/story';

const route = useRoute();
const stories = ref([]);
const loading = ref(true);
const keyword = ref('');

onMounted(async () => {
  keyword.value = route.query.q || '';
  if (keyword.value) {
    await searchStories();
  }
});

const searchStories = async () => {
  try {
    loading.value = true;
    const response = await storyAPI.searchStories(keyword.value);
    stories.value = response.data.data.content;
  } catch (error) {
    console.error('Search error:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Kết quả tìm kiếm: "{{ keyword }}"
      </h1>
      
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <ProgressSpinner />
        <p class="mt-4 text-gray-600 dark:text-gray-400">Đang tìm kiếm...</p>
      </div>
      
      <div v-else-if="stories.length === 0" class="text-center py-20">
        <i class="pi pi-search text-6xl text-gray-400 mb-4"></i>
        <p class="text-gray-600 dark:text-gray-400">Không tìm thấy truyện nào phù hợp</p>
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
