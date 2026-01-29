<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Navbar from '@/components/common/Navbar.vue';
import StoryCard from '@/components/common/StoryCard.vue';
import Chip from 'primevue/chip';
import Button from 'primevue/button';
import Card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';
import { getStories } from '@/api/story';
import { getCategories } from '@/api/category';
import { getReadingHistory } from '@/api/history';

const router = useRouter();
const authStore = useAuthStore();

const stories = ref([]);
const categories = ref([]);
const recentReading = ref([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    loading.value = true;
    
    const promises = [
      getStories(0, 24), // Lấy 24 truyện
      getCategories(0, 20),
    ];
    
    // Load reading history if logged in
    if (authStore.isAuthenticated) {
      promises.push(getReadingHistory(0, 6)); // 6 truyện gần đây
    }
    
    const results = await Promise.all(promises);
    
    // Safe check for response data
    stories.value = results[0]?.data?.data?.content || [];
    categories.value = results[1]?.data?.data?.content || [];
    
    if (authStore.isAuthenticated && results[2]) {
      recentReading.value = results[2]?.data?.data?.content || [];
    }
  } catch (err) {
    console.error('Error loading home data:', err);
    error.value = 'Không thể tải dữ liệu. Vui lòng thử lại sau.';
  } finally {
    loading.value = false;
  }
});

const continueReading = (history) => {
  router.push({
    name: 'ReadChapter',
    params: {
      storyId: history.storyId,
      chapterId: history.chapterId
    }
  });
};

const viewStory = (storyId) => {
  router.push({
    name: 'StoryDetail',
    params: { id: storyId }
  });
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  return date.toLocaleDateString('vi-VN');
};
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Hero Section -->
      <section class="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 rounded-2xl p-12 mb-12 text-center text-white shadow-xl">
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
        <!-- Continue Reading Section -->
        <section v-if="recentReading.length > 0" class="mb-12">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              <i class="pi pi-history text-indigo-500"></i>
              Đọc gần đây
            </h2>
            <Button
              label="Xem tất cả"
              @click="router.push('/history')"
              text
              icon="pi pi-arrow-right"
              iconPos="right"
            />
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card
              v-for="history in recentReading"
              :key="history.id"
              class="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <template #header>
                <div class="relative h-32 overflow-hidden" @click="viewStory(history.storyId)">
                  <img 
                    :src="history.storyImage || 'https://via.placeholder.com/300x400?text=No+Image'" 
                    :alt="history.storyTitle"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </template>
              
              <template #content>
                <div class="space-y-3">
                  <h3 
                    class="font-bold text-lg text-gray-900 dark:text-white line-clamp-1 cursor-pointer hover:text-indigo-600"
                    @click="viewStory(history.storyId)"
                  >
                    {{ history.storyTitle }}
                  </h3>
                  
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    <p class="mb-1">
                      <i class="pi pi-book mr-2"></i>
                      Chương {{ history.chapterNumber }}: {{ history.chapterTitle }}
                    </p>
                    <p>
                      <i class="pi pi-clock mr-2"></i>
                      {{ formatDate(history.readAt) }}
                    </p>
                  </div>
                  
                  <Button
                    @click="continueReading(history)"
                    label="Tiếp tục đọc"
                    icon="pi pi-play"
                    class="w-full !bg-indigo-600 hover:!bg-indigo-700"
                  />
                </div>
              </template>
            </Card>
          </div>
        </section>

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
                class="cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
              />
            </router-link>
          </div>
        </section>

        <!-- All Stories -->
        <section v-if="stories.length" class="mb-12">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            <i class="pi pi-book text-indigo-500"></i>
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
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
