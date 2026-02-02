<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import { getChaptersByStoryId, getChapterById } from '@/api/chapter';
import { saveReadingHistory } from '@/api/history';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const chapter = ref(null);
const allChapters = ref([]);
const loading = ref(true);
const fontSize = ref(18);
const darkMode = ref(false);

onMounted(async () => {
  await loadChapter();
  
  try {
    const chaptersRes = await getChaptersByStoryId(route.params.storyId);
    allChapters.value = chaptersRes?.data?.data?.content || chaptersRes?.data?.data || [];
  } catch (error) {
    console.error('Error loading chapters:', error);
  }
});

const loadChapter = async () => {
  try {
    loading.value = true;
    const response = await getChapterById(route.params.chapterId);
    chapter.value = response.data.data;
    
    // Save reading history if user is logged in
    if (authStore.isAuthenticated) {
      try {
        await saveReadingHistory(route.params.storyId, route.params.chapterId);
      } catch (error) {
        console.error('Error saving reading history:', error);
        // Don't block reading if history save fails
      }
    }
  } catch (error) {
    console.error('Error loading chapter:', error);
  } finally {
    loading.value = false;
  }
};

const currentChapterIndex = computed(() => {
  return allChapters.value.findIndex(ch => ch.id === parseInt(route.params.chapterId));
});

const hasPrevChapter = computed(() => currentChapterIndex.value > 0);
const hasNextChapter = computed(() => currentChapterIndex.value < allChapters.value.length - 1);

const goToPrevChapter = () => {
  if (hasPrevChapter.value) {
    const prevChapter = allChapters.value[currentChapterIndex.value - 1];
    router.push({ name: 'ReadChapter', params: { storyId: route.params.storyId, chapterId: prevChapter.id } });
    loadChapter();
    window.scrollTo(0, 0);
  }
};

const goToNextChapter = () => {
  if (hasNextChapter.value) {
    const nextChapter = allChapters.value[currentChapterIndex.value + 1];
    router.push({ name: 'ReadChapter', params: { storyId: route.params.storyId, chapterId: nextChapter.id } });
    loadChapter();
    window.scrollTo(0, 0);
  }
};

const backToStory = () => {
  router.push({ name: 'StoryDetail', params: { id: route.params.storyId } });
};
</script>

<template>
  <div :class="['min-h-screen transition-colors', darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-white text-gray-900']">
    <!-- Reading Controls -->
    <div class="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50 shadow-sm">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Button
          @click="backToStory"
          icon="pi pi-arrow-left"
          label="Quay lại"
          text
          class="!text-sky-600 dark:!text-sky-400"
        />
        
        <div class="flex items-center gap-4">
          <!-- Font Size Control -->
          <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
            <Button
              @click="fontSize = Math.max(14, fontSize - 2)"
              icon="pi pi-minus"
              text
              rounded
              size="small"
              class="!w-8 !h-8"
            />
            <span class="text-sm font-medium min-w-[50px] text-center">{{ fontSize }}px</span>
            <Button
              @click="fontSize = Math.min(24, fontSize + 2)"
              icon="pi pi-plus"
              text
              rounded
              size="small"
              class="!w-8 !h-8"
            />
          </div>
          
          <!-- Dark Mode Toggle -->
          <Button
            @click="darkMode = !darkMode"
            :icon="darkMode ? 'pi pi-sun' : 'pi pi-moon'"
            rounded
            :class="darkMode ? '!bg-yellow-500 !text-white' : '!bg-gray-800 !text-white'"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <ProgressSpinner />
      <p class="mt-4 text-gray-600 dark:text-gray-400">Đang tải chương...</p>
    </div>

    <!-- Chapter Content -->
    <div v-else-if="chapter" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Chapter Header -->
      <div class="text-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-lg text-gray-600 dark:text-gray-400 mb-3">
          {{ chapter.story?.title }}
        </h1>
        <h2 class="text-2xl md:text-3xl font-bold mb-3">
          Chương {{ chapter.chapterNumber }}: {{ chapter.title }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Cập nhật: {{ new Date(chapter.createdAt).toLocaleDateString('vi-VN') }}
        </p>
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
  </div>
</template>

<style scoped>
</style>
