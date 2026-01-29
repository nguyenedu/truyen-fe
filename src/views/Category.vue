<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/common/Navbar.vue';
import StoryCard from '@/components/common/StoryCard.vue';
import ProgressSpinner from 'primevue/progressspinner';
import Paginator from 'primevue/paginator';
import { getStoriesByCategory } from '@/api/story';
import { getCategoryById } from '@/api/category';

const route = useRoute();
const category = ref(null);
const stories = ref([]);
const loading = ref(true);
const totalRecords = ref(0);
const currentPage = ref(0);
const pageSize = ref(12);

onMounted(async () => {
  await loadCategoryAndStories();
});

const loadCategoryAndStories = async () => {
  const categoryId = route.params.id;
  
  try {
    loading.value = true;
    const [categoryRes, storiesRes] = await Promise.all([
      getCategoryById(categoryId),
      getStoriesByCategory(categoryId, currentPage.value, pageSize.value),
    ]);
    
    category.value = categoryRes.data.data;
    const data = storiesRes.data.data;
    stories.value = data.content || [];
    totalRecords.value = data.totalElements || 0;
  } catch (error) {
    console.error('Error loading category:', error);
  } finally {
    loading.value = false;
  }
};

const onPageChange = (event) => {
  currentPage.value = event.page;
  loadCategoryAndStories();
  window.scrollTo(0, 0);
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <ProgressSpinner />
        <p class="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
      </div>
      
      <div v-else>
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {{ category?.name || 'Thể loại' }}
          </h1>
          <p v-if="category?.description" class="text-gray-600 dark:text-gray-400 mb-4">
            {{ category.description }}
          </p>
          <p class="text-gray-600 dark:text-gray-400">
            {{ totalRecords }} truyện
          </p>
        </div>
        
        <div v-if="stories.length === 0" class="text-center py-20">
          <i class="pi pi-book text-6xl text-gray-400 mb-4"></i>
          <p class="text-gray-600 dark:text-gray-400">Chưa có truyện nào trong thể loại này</p>
        </div>
        
        <div v-else>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <StoryCard
              v-for="story in stories"
              :key="story.id"
              :story="story"
            />
          </div>
          
          <Paginator
            v-if="totalRecords > pageSize"
            :rows="pageSize"
            :totalRecords="totalRecords"
            :first="currentPage * pageSize"
            @page="onPageChange"
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          />
        </div>
      </div>
    </div>
  </div>
</template>
