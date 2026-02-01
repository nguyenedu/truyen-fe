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
  const views = props.story.totalViews || props.story.viewCount || 0;
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views;
});

const chapterCount = computed(() => {
  return props.story.totalChapters || props.story.chapterCount || 0;
});

const primaryCategory = computed(() => {
  if (Array.isArray(props.story.categories)) {
    return props.story.categories[0] || 'Chưa phân loại';
  }
  return 'Chưa phân loại';
});

const authorName = computed(() => {
  return props.story.authorName || props.story.author?.name || 'Tác giả ẩn danh';
});
</script>

<template>
  <router-link :to="`/story/${story.id}`" class="block group">
    <Card class="h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 overflow-hidden">
      <template #header>
        <div class="relative overflow-hidden aspect-[2/3]">
          <img 
            :src="story.image || 'https://via.placeholder.com/300x400?text=No+Image'" 
            :alt="story.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          <!-- Custom badge slot (for trending rank, etc) -->
          <slot name="badge"></slot>
          
          <Tag 
            :value="primaryCategory" 
            severity="info"
            class="absolute top-1 right-1 text-xs"
          />
        </div>
      </template>
      
      <template #content>
        <div class="space-y-0.5 -mt-3">
          <h3 class="font-bold text-sm text-gray-900 dark:text-white line-clamp-2">
            {{ story.title }}
          </h3>
          <p class="text-xs text-gray-600 dark:text-gray-400 truncate">
            <i class="pi pi-user text-xs mr-1"></i>
            {{ authorName }}
          </p>
          
          <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-0.5 border-t border-gray-200 dark:border-gray-700">
            <span class="flex items-center gap-1">
              <i class="pi pi-eye text-xs"></i>
              {{ formattedViews }}
            </span>
            <span class="flex items-center gap-1">
              <i class="pi pi-book text-xs"></i>
              {{ chapterCount }}
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
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Override PrimeVue Card padding */
:deep(.p-card-body) {
  padding: 0;
}

:deep(.p-card-content) {
  padding: 0.5rem;
  padding-top: 0.25rem;
}
</style>
