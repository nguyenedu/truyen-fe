<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Navbar from '@/components/common/Navbar.vue';
import RatingSection from '@/components/story/RatingSection.vue';
import CommentSection from '@/components/story/CommentSection.vue';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Chip from 'primevue/chip';
import ProgressSpinner from 'primevue/progressspinner';
import { useToast } from 'primevue/usetoast';
import { getStoryById } from '@/api/story';
import { getChaptersByStoryId } from '@/api/chapter';
import { checkFavorite, addFavorite, removeFavorite, getFavoriteCount } from '@/api/favorite';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const story = ref(null);
const chapters = ref([]);
const loading = ref(true);
const isFavorited = ref(false);
const favoriteCount = ref(0);
const favoriteLoading = ref(false);

onMounted(async () => {
  const storyId = route.params.id;
  
  try {
    loading.value = true;
    const [storyRes, chaptersRes] = await Promise.all([
      getStoryById(storyId),
      getChaptersByStoryId(storyId),
    ]);
    
    story.value = storyRes.data.data;
    chapters.value = chaptersRes?.data?.data?.content || chaptersRes?.data?.data || [];
    
    // Load favorite status and count
    await loadFavoriteStatus();
  } catch (error) {
    console.error('Error loading story:', error);
  } finally {
    loading.value = false;
  }
});

const loadFavoriteStatus = async () => {
  if (!authStore.isAuthenticated) return;
  
  try {
    const [statusRes, countRes] = await Promise.all([
      checkFavorite(route.params.id),
      getFavoriteCount(route.params.id),
    ]);
    
    isFavorited.value = statusRes.data.data;
    favoriteCount.value = countRes.data.data;
  } catch (error) {
    console.error('Error loading favorite status:', error);
  }
};

const toggleFavorite = async () => {
  if (!authStore.isAuthenticated) {
    toast.add({
      severity: 'warn',
      summary: 'Chưa đăng nhập',
      detail: 'Vui lòng đăng nhập để thêm vào yêu thích',
      life: 3000
    });
    router.push('/login');
    return;
  }
  
  try {
    favoriteLoading.value = true;
    
    if (isFavorited.value) {
      await removeFavorite(route.params.id);
      isFavorited.value = false;
      favoriteCount.value = Math.max(0, favoriteCount.value - 1);
      toast.add({
        severity: 'success',
        summary: 'Đã xóa',
        detail: 'Đã xóa khỏi danh sách yêu thích',
        life: 3000
      });
    } else {
      await addFavorite(route.params.id);
      isFavorited.value = true;
      favoriteCount.value += 1;
      toast.add({
        severity: 'success',
        summary: 'Đã thêm',
        detail: 'Đã thêm vào danh sách yêu thích',
        life: 3000
      });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error.response?.data?.message || 'Có lỗi xảy ra',
      life: 3000
    });
  } finally {
    favoriteLoading.value = false;
  }
};

const readChapter = (chapterId) => {
  router.push({ name: 'ReadChapter', params: { storyId: story.value.id, chapterId } });
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <ProgressSpinner />
      <p class="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
    </div>
    
    <div v-else-if="story" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Story Info -->
      <div class="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 mb-8">
        <div class="mx-auto md:mx-0">
          <img 
            :src="story.image || 'https://via.placeholder.com/300x400?text=No+Image'" 
            :alt="story.title"
            class="w-full max-w-[250px] rounded-xl shadow-lg"
          />
        </div>
        
        <div class="space-y-4">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {{ story.title }}
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Tác giả: <strong>{{ story.authorName || 'Ẩn danh' }}</strong>
          </p>
          
          <div class="flex flex-wrap gap-2">
            <Tag icon="pi pi-eye" :value="`${story.totalViews || 0} lượt xem`" />
            <Tag icon="pi pi-book" :value="`${story.totalChapters || 0} chương`" severity="info" />
            <Tag 
              :icon="story.status === 'COMPLETED' ? 'pi pi-check' : 'pi pi-pencil'"
              :value="story.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang tiến hành'"
              :severity="story.status === 'COMPLETED' ? 'success' : 'warning'"
            />
            <Tag 
              icon="pi pi-heart-fill" 
              :value="`${favoriteCount} yêu thích`" 
              severity="danger"
            />
          </div>
          
          <div v-if="story.categories?.length" class="flex flex-wrap gap-2">
            <Chip 
              v-for="(category, index) in story.categories" 
              :key="index"
              :label="category" 
              class="cursor-pointer" 
            />
          </div>
          
          <div class="flex gap-3 pt-2">
            <Button
              v-if="chapters.length"
              @click="readChapter(chapters[0].id)"
              label="Đọc từ đầu"
              icon="pi pi-book"
              size="large"
              class="!bg-indigo-600 hover:!bg-indigo-700"
            />
            
            <Button
              @click="toggleFavorite"
              :label="isFavorited ? 'Bỏ yêu thích' : 'Yêu thích'"
              :icon="isFavorited ? 'pi pi-heart-fill' : 'pi pi-heart'"
              :loading="favoriteLoading"
              :outlined="!isFavorited"
              :severity="isFavorited ? 'danger' : 'secondary'"
              size="large"
            />
          </div>
        </div>
      </div>
      
      <!-- Description -->
      <div v-if="story.description" class="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Giới thiệu</h2>
        <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
          {{ story.description }}
        </p>
      </div>
      
      <!-- Chapters List -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-8">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Danh sách chương ({{ chapters.length }})
        </h2>
        
        <div v-if="chapters.length === 0" class="text-center py-10 text-gray-500 dark:text-gray-400">
          <p>Chưa có chương nào</p>
        </div>
        
        <div v-else class="space-y-2">
          <div
            v-for="chapter in chapters"
            :key="chapter.id"
            @click="readChapter(chapter.id)"
            class="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border border-transparent hover:border-indigo-500"
          >
            <span class="font-medium text-gray-900 dark:text-white">
              Chương {{ chapter.chapterNumber }}: {{ chapter.title }}
            </span>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ new Date(chapter.createdAt).toLocaleDateString('vi-VN') }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Rating Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-8">
        <RatingSection :storyId="story.id" />
      </div>
      
      <!-- Comment Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
        <CommentSection :storyId="story.id" />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
