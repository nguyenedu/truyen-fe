<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Navbar from '@/components/common/Navbar.vue';
import StoryCard from '@/components/common/StoryCard.vue';
import Chip from 'primevue/chip';
import Button from 'primevue/button';
import Card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';
import { getStories, getHotStories } from '@/api/story';
import { getCategories } from '@/api/category';
import { getReadingHistory } from '@/api/history';
import { IMAGE_PLACEHOLDER } from '@/utils/constants';
import { formatRelativeDate } from '@/utils/formatters';
import { extractData } from '@/utils/helpers';

const router = useRouter();
const authStore = useAuthStore();

const stories = ref([]);
const categories = ref([]);
const recentReading = ref([]);
const trendingStories = ref([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    loading.value = true;
    
    const promises = [
      getStories(0, 24),
      getCategories(0, 20),
      getHotStories(12),
    ];
    

    if (authStore.isAuthenticated) {
      promises.push(getReadingHistory(0, 6));
    }
    
    const results = await Promise.all(promises);
    
    stories.value = extractData(results[0]).content;
    categories.value = extractData(results[1]).content;
    trendingStories.value = results[2]?.data || [];
    
    if (authStore.isAuthenticated && results[3]) {
      recentReading.value = extractData(results[3]).content;
    }
  } catch (err) {
    console.error('Error loading home data:', err);
    error.value = 'Không thể tải dữ liệu. Vui lòng thử lại sau.';
  } finally {
    loading.value = false;
  }
});


watch(() => authStore.isAuthenticated, (newValue) => {
  if (!newValue) {
    recentReading.value = [];
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

const formatDate = (dateString) => formatRelativeDate(dateString);
</script>

<template>
  <div class="min-h-screen bg-[#f1f5f9]">
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
        <p class="mt-4 text-gray-600">Đang tải dữ liệu...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- Content -->
      <template v-else>
        <!-- Continue Reading Section -->
        <section v-if="recentReading.length > 0" class="mb-12">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-black text-slate-800">
              <i class="pi pi-history text-indigo-500 mr-2"></i>
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
                    :src="history.storyImage || IMAGE_PLACEHOLDER" 
                    :alt="history.storyTitle"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </template>
              
              <template #content>
                <div class="space-y-3">
                  <h3 
                    class="font-bold text-lg text-slate-800 line-clamp-1 cursor-pointer hover:text-indigo-600 transition-colors"
                    @click="viewStory(history.storyId)"
                  >
                    {{ history.storyTitle }}
                  </h3>
                  
                  <div class="text-sm text-slate-500">
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

        <!-- Trending Stories -->
        <section v-if="trendingStories.length > 0" class="mb-12">
          <h2 class="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <i class="pi pi-chart-line text-red-500"></i>
            🔥 Truyện Trending
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <StoryCard
              v-for="(trending, index) in trendingStories"
              :key="trending.storyId"
              :story="{
                id: trending.storyId,
                title: trending.title,
                image: trending.image,
                totalViews: trending.totalViews,
                totalChapters: trending.totalChapters,
                authorName: trending.authorName,
                authorId: trending.authorId,
                categories: trending.categories
              }"
            >
              <!-- Trending Badge -->
              <template #badge>
                <div class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                  #{{ index + 1 }}
                </div>
              </template>
            </StoryCard>
          </div>
        </section>

        <section v-if="categories.length" class="mb-12">
          <h2 class="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <i class="pi pi-tag text-emerald-500"></i>
            Thể loại
          </h2>
          <div class="flex flex-wrap gap-3">
            <router-link
              v-for="category in categories"
              :key="category.id"
              :to="`/category/${category.id}`"
            >
              <Chip 
                :label="category.name" 
                class="cursor-pointer !bg-white !text-slate-600 hover:!bg-indigo-50 hover:!text-indigo-600 !border !border-slate-100 transition-all font-semibold"
              />
            </router-link>
          </div>
        </section>

        <section v-if="stories.length" class="mb-12">
          <h2 class="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
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
