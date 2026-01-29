<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '@/components/common/Navbar.vue';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Chip from 'primevue/chip';
import ProgressSpinner from 'primevue/progressspinner';
import { storyAPI } from '@/api/story';
import { chapterAPI } from '@/api/chapter';

const route = useRoute();
const router = useRouter();
const story = ref(null);
const chapters = ref([]);
const loading = ref(true);

onMounted(async () => {
  const storyId = route.params.id;
  
  try {
    loading.value = true;
    const [storyRes, chaptersRes] = await Promise.all([
      storyAPI.getStoryById(storyId),
      chapterAPI.getChaptersByStory(storyId, 0, 100),
    ]);
    
    story.value = storyRes.data.data;
    chapters.value = chaptersRes.data.data.content;
  } catch (error) {
    console.error('Error loading story:', error);
  } finally {
    loading.value = false;
  }
});

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
            Tác giả: <strong>{{ story.author?.name || 'Ẩn danh' }}</strong>
          </p>
          
          <div class="flex flex-wrap gap-2">
            <Tag icon="pi pi-eye" :value="`${story.viewCount || 0} lượt xem`" />
            <Tag icon="pi pi-book" :value="`${story.chapterCount || 0} chương`" severity="info" />
            <Tag 
              :icon="story.status === 'completed' ? 'pi pi-check' : 'pi pi-pencil'"
              :value="story.status === 'completed' ? 'Hoàn thành' : 'Đang tiến hành'"
              :severity="story.status === 'completed' ? 'success' : 'warning'"
            />
          </div>
          
          <div v-if="story.categories?.length" class="flex flex-wrap gap-2">
            <router-link
              v-for="category in story.categories"
              :key="category.id"
              :to="`/category/${category.id}`"
            >
              <Chip :label="category.name" class="cursor-pointer" />
            </router-link>
          </div>
          
          <div class="pt-2">
            <Button
              v-if="chapters.length"
              @click="readChapter(chapters[0].id)"
              label="Đọc từ đầu"
              icon="pi pi-book"
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
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Danh sách chương ({{ chapters.length }})
        </h2>
        
        <div v-if="chapters.length === 0" class="text-center py-10 text-gray-500 dark:text-gray-400">
          <p>Chưa có chương nào</p>
        </div>
        
        <div v-else class="space-y-2">
          <Button
            v-for="chapter in chapters"
            :key="chapter.id"
            @click="readChapter(chapter.id)"
            :label="`Chương ${chapter.chapterNumber}: ${chapter.title}`"
            text
            class="w-full !justify-between"
          >
            <template #default>
              <span class="font-medium">Chương {{ chapter.chapterNumber }}: {{ chapter.title }}</span>
              <span class="text-sm text-gray-500">
                {{ new Date(chapter.createdAt).toLocaleDateString('vi-VN') }}
              </span>
            </template>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* TailwindCSS handles all styling */
</style>
