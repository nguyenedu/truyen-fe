<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Navbar from '@/components/common/Navbar.vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';
import Paginator from 'primevue/paginator';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { getReadingHistory, deleteStoryHistory, deleteAllHistory } from '@/api/history';

const router = useRouter();
const authStore = useAuthStore();
const confirm = useConfirm();
const toast = useToast();

const histories = ref([]);
const loading = ref(true);
const totalRecords = ref(0);
const currentPage = ref(0);
const pageSize = ref(12);

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  
  await loadHistory();
});

const loadHistory = async () => {
  try {
    loading.value = true;
    const response = await getReadingHistory(currentPage.value, pageSize.value);
    const data = response.data.data;
    
    histories.value = data.content || [];
    totalRecords.value = data.totalElements || 0;
  } catch (error) {
    console.error('Error loading history:', error);
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Không thể tải lịch sử đọc',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

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

const handleDeleteOne = (history) => {
  confirm.require({
    message: `Xóa lịch sử đọc "${history.storyTitle}"?`,
    header: 'Xác nhận xóa',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Xóa',
    rejectLabel: 'Hủy',
    accept: async () => {
      try {
        await deleteStoryHistory(history.storyId);
        toast.add({
          severity: 'success',
          summary: 'Đã xóa',
          detail: 'Đã xóa lịch sử đọc',
          life: 3000
        });
        await loadHistory();
      } catch (error) {
        console.error('Error deleting history:', error);
        toast.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể xóa lịch sử',
          life: 3000
        });
      }
    }
  });
};

const handleDeleteAll = () => {
  confirm.require({
    message: 'Xóa toàn bộ lịch sử đọc? Hành động này không thể hoàn tác.',
    header: 'Xác nhận xóa tất cả',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Xóa tất cả',
    rejectLabel: 'Hủy',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await deleteAllHistory();
        toast.add({
          severity: 'success',
          summary: 'Đã xóa',
          detail: 'Đã xóa toàn bộ lịch sử đọc',
          life: 3000
        });
        histories.value = [];
        totalRecords.value = 0;
      } catch (error) {
        console.error('Error deleting all history:', error);
        toast.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể xóa lịch sử',
          life: 3000
        });
      }
    }
  });
};

const onPageChange = (event) => {
  currentPage.value = event.page;
  loadHistory();
  window.scrollTo(0, 0);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  return date.toLocaleDateString('vi-VN');
};
</script>

<template>
  <div class="min-h-screen bg-[#f1f5f9]">
    <Navbar />
    <ConfirmDialog />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8 p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 class="text-4xl font-black text-slate-800 mb-2 tracking-tighter">
            Lịch sử đọc
          </h1>
          <p class="text-slate-500 font-medium">
            {{ totalRecords }} truyện đã đọc
          </p>
        </div>
        
        <Button
          v-if="histories.length > 0"
          @click="handleDeleteAll"
          label="Xóa tất cả"
          icon="pi pi-trash"
          severity="danger"
          outlined
        />
      </div>
      
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <ProgressSpinner />
        <p class="mt-4 text-slate-500">Đang tải...</p>
      </div>
      
      <div v-else-if="histories.length === 0" class="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
        <div class="mb-6">
          <i class="pi pi-history text-6xl text-slate-200 opacity-50"></i>
        </div>
        <h2 class="text-2xl font-black text-slate-800 mb-4 tracking-tighter">
          Chưa có lịch sử đọc
        </h2>
        <p class="text-slate-400 mb-6 font-medium">
          Bắt đầu đọc truyện để lưu lịch sử
        </p>
        <Button
          label="Khám phá truyện"
          icon="pi pi-search"
          @click="router.push('/browse')"
          class="!bg-indigo-600 hover:!bg-indigo-700 px-8 py-3 rounded-xl font-bold"
        />
      </div>
      
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card v-for="history in histories" :key="history.id" class="hover:shadow-lg transition-shadow">
            <template #header>
              <div class="relative overflow-hidden h-48 cursor-pointer" @click="viewStory(history.storyId)">
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
                  class="font-black text-lg text-slate-800 line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors"
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
                
                <div class="flex gap-2 pt-2">
                  <Button
                    @click="continueReading(history)"
                    label="Đọc tiếp"
                    icon="pi pi-play"
                    size="small"
                    class="flex-1 !bg-indigo-600 hover:!bg-indigo-700"
                  />
                  <Button
                    @click="handleDeleteOne(history)"
                    icon="pi pi-trash"
                    severity="danger"
                    outlined
                    size="small"
                  />
                </div>
              </div>
            </template>
          </Card>
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
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
