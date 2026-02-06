<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import { formatDate } from '@/utils/formatters';
import { useUIStore } from '@/stores/ui';
import { useToast } from 'primevue/usetoast';
import { showErrorToast } from '@/utils/helpers';
import { ERROR_MESSAGES } from '@/utils/errors';
import { getChaptersByStoryId, getChapterById } from '@/api/chapter';
import { saveReadingHistory } from '@/api/history';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUIStore();
const toast = useToast();
const chapter = ref(null);
const allChapters = ref([]);
const fontSize = ref(18);
const darkMode = ref(false);
const showScrollTop = ref(false);
const showChapterDialog = ref(false);

// Scroll to top functionality
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Chapter selection dialog
const toggleChapterDialog = () => {
  showChapterDialog.value = !showChapterDialog.value;
};

const goToChapter = (chapterId) => {
  showChapterDialog.value = false;
  router.push({ 
    name: 'ReadChapter', 
    params: { storyId: route.params.storyId, chapterId } 
  });
};

onMounted(async () => {
  await loadChaptersList();
  await loadChapter();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

watch(() => route.params.chapterId, async (newId) => {
  if (newId) {
    await loadChapter();
  }
});

const loadChaptersList = async () => {
  try {
    const chaptersRes = await getChaptersByStoryId(route.params.storyId);
    const data = chaptersRes?.data?.data;
    allChapters.value = data?.content || data || [];
  } catch (error) {
    showErrorToast(toast, error, ERROR_MESSAGES.LOAD_CHAPTERS_FAILED);
  }
};

const loadChapter = async () => {
  const chapterId = route.params.chapterId;
  if (!chapterId) return;

  try {
    uiStore.startLoading();
    const response = await getChapterById(chapterId);
    chapter.value = response.data.data;

    if (authStore.isAuthenticated) {
      try {
        await saveReadingHistory(route.params.storyId, chapterId);
      } catch (error) {
        console.error('Error saving reading history:', error);
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    showErrorToast(toast, error, ERROR_MESSAGES.LOAD_CHAPTER_CONTENT_FAILED);
  } finally {
    uiStore.stopLoading();
  }
};

const currentChapterIndex = computed(() => {
  const currentId = parseInt(route.params.chapterId);
  return allChapters.value.findIndex(ch => ch.id === currentId);
});

const hasPrevChapter = computed(() => currentChapterIndex.value > 0);
const hasNextChapter = computed(() => {
    if (allChapters.value.length === 0) return false;
    return currentChapterIndex.value >= 0 && currentChapterIndex.value < allChapters.value.length - 1;
});

const goToPrevChapter = () => {
  if (hasPrevChapter.value) {
    const prevChapter = allChapters.value[currentChapterIndex.value - 1];
    router.push({ 
        name: 'ReadChapter', 
        params: { storyId: route.params.storyId, chapterId: prevChapter.id } 
    });
  }
};

const goToNextChapter = () => {
  if (hasNextChapter.value) {
    const nextChapter = allChapters.value[currentChapterIndex.value + 1];
    router.push({ 
        name: 'ReadChapter', 
        params: { storyId: route.params.storyId, chapterId: nextChapter.id } 
    });
  }
};

const backToStory = () => {
  router.push({ name: 'StoryDetail', params: { id: route.params.storyId } });
};
</script>

<template>
  <div :class="['min-h-screen transition-colors', darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-white text-gray-900']">
    <!-- Reading Controls -->
    <div class="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50 shadow-lg backdrop-blur-md bg-opacity-90">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Button
          @click="backToStory"
          icon="pi pi-arrow-left"
          label="Quay lại"
          text
          class="!text-indigo-600 dark:!text-indigo-400 font-bold"
        />
        
        <!-- Chapter List Button -->
        <Button
          @click="toggleChapterDialog"
          icon="pi pi-list"
          label="Danh sách chương"
          text
          class="!text-indigo-600 dark:!text-indigo-400 font-bold"
        />
        
        <div class="flex items-center gap-4">
          <!-- Font Size Control -->
          <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1.5 border border-gray-200 dark:border-gray-700">
            <Button
              @click="fontSize = Math.max(14, fontSize - 2)"
              icon="pi pi-minus"
              text
              rounded
              size="small"
              class="!w-10 !h-10 !text-indigo-600 dark:!text-indigo-400 hover:!bg-indigo-50 dark:hover:!bg-indigo-900/40"
            />
            <div class="px-3">
                <span class="text-sm font-bold text-gray-700 dark:text-gray-200">{{ fontSize }}px</span>
            </div>
            <Button
              @click="fontSize = Math.min(24, fontSize + 2)"
              icon="pi pi-plus"
              text
              rounded
              size="small"
              class="!w-10 !h-10 !text-indigo-600 dark:!text-indigo-400 hover:!bg-indigo-50 dark:hover:!bg-indigo-900/40"
            />
          </div>
          
          <!-- Dark Mode Toggle -->
          <Button
            @click="darkMode = !darkMode"
            :icon="darkMode ? 'pi pi-sun' : 'pi pi-moon'"
            rounded
            class="!w-10 !h-10 !border-0 shadow-md"
            :class="darkMode ? '!bg-amber-400 !text-black hover:!bg-amber-300' : '!bg-indigo-600 !text-white hover:!bg-indigo-700'"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="uiStore.loading" class="flex flex-col items-center justify-center py-32">
      <ProgressSpinner strokeWidth="4" />
      <p class="mt-4 text-indigo-600 dark:text-indigo-400 font-bold animate-pulse">Đang tải chương...</p>
    </div>

    <!-- Chapter Content -->
    <div v-else-if="chapter" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Chapter Header -->
      <div class="text-center mb-12 pb-8 border-b border-indigo-100 dark:border-gray-800">
        <h1 class="text-sm font-bold uppercase tracking-widest text-indigo-500 mb-4">
          {{ chapter.story?.title }}
        </h1>
        <h2 class="text-3xl md:text-4xl font-black mb-6 tracking-tight">
          Chương {{ chapter.chapterNumber }}: {{ chapter.title }}
        </h2>
        <div class="flex items-center justify-center gap-2 text-sm text-gray-400 font-medium">
          <i class="pi pi-calendar"></i>
          <span>Cập nhật: {{ formatDate(chapter.createdAt) }}</span>
        </div>
      </div>

      <!-- Chapter Content -->
      <div 
        class="mb-12 leading-relaxed"
        :style="{ fontSize: fontSize + 'px', lineHeight: '1.8' }"
      >
        <p 
          v-for="(paragraph, index) in chapter.content?.split('\n')" 
          :key="index" 
          class="mb-6 text-justify"
        >
          {{ paragraph }}
        </p>
      </div>

      <!-- Navigation -->
      <div class="flex flex-col sm:flex-row gap-3 pt-8 border-t border-gray-200 dark:border-gray-700">
        <Button
          @click="goToPrevChapter"
          :disabled="!hasPrevChapter"
          label="Chương trước"
          icon="pi pi-chevron-left"
          class="flex-1"
          size="large"
        />
        
        <Button
          @click="backToStory"
          label="Danh sách chương"
          icon="pi pi-list"
          outlined
          class="flex-1"
          size="large"
        />
        
        <Button
          @click="goToNextChapter"
          :disabled="!hasNextChapter"
          label="Chương sau"
          icon="pi pi-chevron-right"
          iconPos="right"
          class="flex-1"
          size="large"
        />
      </div>
    </div>

    <!-- Chapter Selection Dialog -->
    <Dialog
      v-model:visible="showChapterDialog"
      modal
      :header="chapter?.story?.title || 'Danh sách chương'"
      :style="{ width: '90vw', maxWidth: '800px' }"
      :dismissableMask="true"
      class="chapter-dialog"
    >
      <div class="max-h-[60vh] overflow-y-auto">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-2">
          <Button
            v-for="ch in allChapters"
            :key="ch.id"
            @click="goToChapter(ch.id)"
            :label="`Chương ${ch.chapterNumber}`"
            :outlined="ch.id !== parseInt(route.params.chapterId)"
            :severity="ch.id === parseInt(route.params.chapterId) ? 'primary' : 'secondary'"
            class="!text-sm !py-3 !font-semibold transition-all hover:!scale-105"
            :class="ch.id === parseInt(route.params.chapterId) ? '!bg-indigo-600 !text-white !border-indigo-600' : ''"
          />
        </div>
      </div>
    </Dialog>

    <!-- Scroll to Top Button -->
    <Transition name="fade-slide">
      <Button
        v-if="showScrollTop"
        @click="scrollToTop"
        icon="pi pi-arrow-up"
        rounded
        class="!fixed !bottom-8 !right-8 !w-14 !h-14 !shadow-2xl !border-0 !z-40 hover:!scale-110 !transition-all !duration-300"
        :class="darkMode ? '!bg-indigo-600 !text-white hover:!bg-indigo-700' : '!bg-indigo-600 !text-white hover:!bg-indigo-700'"
        aria-label="Lướt lên đầu trang"
      />
    </Transition>
  </div>
</template>

<style scoped>
/* Scroll to Top Button Animation */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Chapter Dialog Styling */
:deep(.chapter-dialog .p-dialog-content) {
  padding: 0.5rem;
}

:deep(.chapter-dialog .p-dialog-header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
  border-radius: 0.5rem 0.5rem 0 0;
}

/* Custom Scrollbar */
.max-h-\[60vh\]::-webkit-scrollbar {
  width: 8px;
}

.max-h-\[60vh\]::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.max-h-\[60vh\]::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 10px;
}

.max-h-\[60vh\]::-webkit-scrollbar-thumb:hover {
  background: #764ba2;
}

</style>
