<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import Navbar from '@/components/common/Navbar.vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';
import Paginator from 'primevue/paginator';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { getReadingHistory, deleteStoryHistory, deleteAllHistory } from '@/api/history';
import { PAGINATION, IMAGE_PLACEHOLDER } from '@/utils/constants';
import { formatDate, formatRelativeDate } from '@/utils/formatters';
import { ERROR_MESSAGES } from '@/utils/errors';
import { handleAuthRequired, showSuccessToast, showErrorToast, extractData } from '@/utils/helpers';

const router = useRouter();
const authStore = useAuthStore();
const confirm = useConfirm();
const toast = useToast();

const uiStore = useUIStore();
const histories = ref([]);

import { usePagination } from '@/composables/usePagination';

const { totalRecords, currentPage, pageSize, onPageChange } = usePagination(PAGINATION.HISTORY_PAGE_SIZE);

onMounted(async () => {
  if (handleAuthRequired(authStore, router, toast)) return;
  await loadHistory();
});

const loadHistory = async () => {
  try {
    uiStore.startLoading();
    const response = await getReadingHistory(currentPage.value, pageSize.value);
    const { content, total } = extractData(response);
    
    histories.value = content;
    totalRecords.value = total;
  } catch (error) {
    showErrorToast(toast, error, ERROR_MESSAGES.LOAD_HISTORY_FAILED);
  } finally {
    uiStore.stopLoading();
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
        showSuccessToast(toast, 'Đã xóa', 'Đã xóa lịch sử đọc');
        await loadHistory();
      } catch (error) {
        showErrorToast(toast, error, 'Không thể xóa lịch sử');
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
        showSuccessToast(toast, 'Đã xóa', 'Đã xóa toàn bộ lịch sử đọc');
        histories.value = [];
        totalRecords.value = 0;
      } catch (error) {
        showErrorToast(toast, error, 'Không thể xóa lịch sử');
      }
    }
  });
};

const handlePageChange = (event) => onPageChange(event, loadHistory);

const getRelativeDate = (dateString) => formatRelativeDate(dateString);
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
      
      <div v-if="uiStore.loading" class="flex flex-col items-center justify-center py-20">
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
                  :src="history.storyImage || IMAGE_PLACEHOLDER" 
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
                    {{ getRelativeDate(history.readAt) }}
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
          @page="handlePageChange"
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
