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

const authorId = computed(() => {
  return props.story.authorId || props.story.author?.id;
});
</script>

<template>
  <div class="h-full group">
    <Card class="h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 overflow-hidden">
      <template #header>
        <router-link :to="`/story/${story.id}`" class="block relative overflow-hidden aspect-[2/3]">
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
        </router-link>
      </template>

      <template #content>
        <div class="space-y-1">
          <router-link :to="`/story/${story.id}`" class="block">
            <h3 class="font-bold text-sm text-slate-800 min-h-[2.5rem] leading-tight hover:text-indigo-600 transition-colors">
              {{ story.title }}
            </h3>
          </router-link>
          
          <router-link 
            :to="`/author/${authorId}`" 
            class="text-xs text-slate-500 truncate block hover:text-indigo-600 transition-colors"
          >
            <i class="pi pi-user text-xs mr-1"></i>
            {{ authorName }}
          </router-link>

          <router-link :to="`/story/${story.id}`" class="block">
            <div class="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-100">
              <span class="flex items-center gap-1">
                <i class="pi pi-eye text-xs"></i>
                {{ formattedViews }}
              </span>
              <span class="flex items-center gap-1">
                <i class="pi pi-book text-xs"></i>
                {{ chapterCount }}
              </span>
            </div>
          </router-link>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
:deep(.p-card-body) {
  padding: 0;
}

:deep(.p-card-content) {
  padding: 0.75rem;
  padding-top: 0.5rem;
}
</style>