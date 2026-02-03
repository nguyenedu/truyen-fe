<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Navbar from '@/components/common/Navbar.vue';
import StoryCard from '@/components/common/StoryCard.vue';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Paginator from 'primevue/paginator';
import { getFavorites, removeFavorite } from '@/api/favorite';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const favorites = ref([]);
const loading = ref(true);
const totalRecords = ref(0);
const currentPage = ref(0);
const pageSize = ref(12);

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  
  await loadFavorites();
});

const loadFavorites = async () => {
  try {
    loading.value = true;
    const response = await getFavorites(currentPage.value, pageSize.value);
    const data = response.data.data;
    
    // Transform FavoriteResponse to Story format for StoryCard
    favorites.value = data.content.map(fav => ({
      id: fav.storyId,
      title: fav.storyTitle,
      image: fav.storyImage,
      authorName: fav.authorName || 'Ẩn danh',
      categories: fav.categories || [],
      totalViews: fav.totalViews || 0,
      totalChapters: fav.totalChapters || 0,
      favoriteId: fav.id // Keep favorite ID for removal
    }));
    
    totalRecords.value = data.totalElements;
  } catch (error) {
    console.error('Error loading favorites:', error);
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Không thể tải danh sách yêu thích',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const handleRemoveFavorite = async (storyId) => {
  try {
    await removeFavorite(storyId);
    toast.add({
      severity: 'success',
      summary: 'Đã xóa',
      detail: 'Đã xóa khỏi danh sách yêu thích',
      life: 3000
    });
    
    // Reload favorites
    await loadFavorites();
  } catch (error) {
    console.error('Error removing favorite:', error);
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Không thể xóa khỏi yêu thích',
      life: 3000
    });
  }
};

const onPageChange = (event) => {
  currentPage.value = event.page;
  loadFavorites();
  window.scrollTo(0, 0);
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Truyện yêu thích
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Danh sách {{ totalRecords }} truyện bạn đã yêu thích
        </p>
      </div>
      
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <ProgressSpinner />
        <p class="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
      </div>
      
      <div v-else-if="favorites.length === 0" class="text-center py-20">
        <div class="mb-6">
          <i class="pi pi-heart text-6xl text-gray-300"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Chưa có truyện yêu thích
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Hãy thêm truyện vào danh sách yêu thích để đọc sau
        </p>
        <Button
          label="Khám phá truyện"
          icon="pi pi-search"
          @click="router.push('/')"
          size="large"
        />
      </div>
      
      <div v-else>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div v-for="story in favorites" :key="story.id" class="relative group">
            <StoryCard :story="story" />
            
            <!-- Remove button overlay -->
            <Button
              @click.prevent="handleRemoveFavorite(story.id)"
              icon="pi pi-times"
              rounded
              severity="danger"
              class="!absolute !top-2 !right-2 !opacity-0 group-hover:!opacity-100 !transition-opacity !z-10"
              size="small"
            />
          </div>
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
</template>

<style scoped>
</style>
