<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';
import Slider from 'primevue/slider';
import ToggleButton from 'primevue/togglebutton';
import ProgressSpinner from 'primevue/progressspinner';
import { chapterAPI } from '@/api/chapter';

const route = useRoute();
const router = useRouter();
const chapter = ref(null);
const allChapters = ref([]);
const loading = ref(true);
const fontSize = ref(16);
const darkMode = ref(false);

onMounted(async () => {
  await loadChapter();
  
  try {
    const chaptersRes = await chapterAPI.getChaptersByStory(route.params.storyId, 0, 1000);
    allChapters.value = chaptersRes.data.data.content;
  } catch (error) {
    console.error('Error loading chapters:', error);
  }
});

const loadChapter = async () => {
  try {
    loading.value = true;
    const response = await chapterAPI.getChapterById(route.params.chapterId);
    chapter.value = response.data.data;
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
    <div class="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-50 shadow-sm">
      <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Button
          @click="backToStory"
          icon="pi pi-arrow-left"
          label="Quay lại"
          text
          size="small"
        />
        
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <Button
              @click="fontSize = Math.max(12, fontSize - 2)"
              icon="pi pi-minus"
              text
              rounded
              size="small"
            />
            <span class="text-sm font-medium min-w-[60px] text-center">{{ fontSize }}px</span>
            <Button
              @click="fontSize = Math.min(24, fontSize + 2)"
              icon="pi pi-plus"
              text
              rounded
              size="small"
            />
          </div>
          
          <ToggleButton
            v-model="darkMode"
            onIcon="pi pi-sun"
            offIcon="pi pi-moon"
            class="w-10 h-10"
          />
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <ProgressSpinner />
      <p class="mt-4 text-gray-600 dark:text-gray-400">Đang tải chương...</p>
    </div>

    <div v-else-if="chapter" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Chapter Header -->
      <div class="text-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-xl text-gray-600 dark:text-gray-400 mb-4">
          {{ chapter.story?.title }}
        </h1>
        <h2 class="text-3xl font-bold mb-3">
          Chương {{ chapter.chapterNumber }}: {{ chapter.title }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Cập nhật: {{ new Date(chapter.createdAt).toLocaleDateString('vi-VN') }}
        </p>
      </div>

      <!-- Chapter Content -->
      <div 
        class="prose prose-lg dark:prose-invert max-w-none mb-12"
        :style="{ fontSize: fontSize + 'px' }"
      >
        <p v-for="(paragraph, index) in chapter.content?.split('\n')" :key="index" class="mb-6 text-justify leading-relaxed">
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
/* TailwindCSS prose plugin for content styling */
</style>
