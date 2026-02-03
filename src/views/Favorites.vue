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
  <div class="min-h-screen bg-[#f1f5f9]">
    <Navbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8 p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
        <h1 class="text-4xl font-black text-slate-800 mb-2 tracking-tighter">
          Truyện yêu thích
        </h1>
        <p class="text-slate-500 font-medium">
          Danh sách {{ totalRecords }} truyện bạn đã yêu thích
        </p>
      </div>
      
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <ProgressSpinner />
        <p class="mt-4 text-slate-500">Đang tải...</p>
      </div>
      
      <div v-else-if="favorites.length === 0" class="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
        <div class="mb-6">
          <i class="pi pi-heart text-6xl text-slate-200 opacity-50"></i>
        </div>
        <h2 class="text-2xl font-black text-slate-800 mb-4 tracking-tighter">
          Chưa có truyện yêu thích
        </h2>
        <p class="text-slate-400 mb-6 font-medium">
          Hãy thêm truyện vào danh sách yêu thích để đọc sau
        </p>
        <Button
          label="Khám phá truyện"
          icon="pi pi-search"
          @click="router.push('/browse')"
          class="!bg-indigo-600 hover:!bg-indigo-700 px-8 py-3 rounded-xl font-bold"
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
