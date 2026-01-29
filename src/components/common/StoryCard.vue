<script setup>
import { computed } from 'vue';
import Card from 'primevue/card';
import Tag from 'primevue/tag';

const props = defineProps({
  story: {
    type: Object,
    required: true,
  },
});

const formattedViews = computed(() => {
  const views = props.story.viewCount || 0;
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views;
});

const primaryCategory = computed(() => {
  return props.story.categories?.[0]?.name || 'Chưa phân loại';
});
</script>

<template>
  <router-link :to="`/story/${story.id}`" class="block group">
    <Card class="h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
      <template #header>
        <div class="relative overflow-hidden aspect-[3/4]">
          <img 
            :src="story.image || 'https://via.placeholder.com/300x400?text=No+Image'" 
            :alt="story.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Tag 
            :value="primaryCategory" 
            severity="info"
            class="absolute top-2 right-2"
          />
        </div>
      </template>
      
      <template #content>
        <div class="space-y-2">
          <h3 class="font-bold text-gray-900 dark:text-white line-clamp-2 min-h-[3rem]">
            {{ story.title }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
            {{ story.author?.name || 'Tác giả ẩn danh' }}
          </p>
          
          <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 pt-2">
            <span class="flex items-center gap-1">
              <i class="pi pi-eye"></i>
              {{ formattedViews }}
            </span>
            <span class="flex items-center gap-1">
              <i class="pi pi-book"></i>
              {{ story.chapterCount || 0 }}
            </span>
          </div>
        </div>
      </template>
    </Card>
  </router-link>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
