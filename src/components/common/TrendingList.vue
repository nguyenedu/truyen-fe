<template>
  <div class="trending-list">
    <div 
      v-for="(story, index) in stories" 
      :key="story.storyId"
      class="trending-item"
      @click="goToStory(story.storyId)"
    >
      <span class="story-title">{{ story.title }}</span>
      <span class="story-rank">#{{ index + 1 }}</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  stories: {
    type: Array,
    default: () => []
  }
});

const router = useRouter();

const goToStory = (id) => {
  router.push(`/story/${id}`);
};
</script>

<style scoped>
.trending-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.trending-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
}

.trending-item:hover {
  background: #f9fafb;
  border-color: #3b82f6;
  transform: translateX(4px);
}

.story-title {
  flex: 1;
  font-size: 0.95rem;
  color: #1f2937;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 1rem;
}

.story-rank {
  font-size: 0.875rem;
  font-weight: 700;
  color: #ef4444;
  min-width: 2rem;
  text-align: right;
}


.dark .trending-item {
  background: #1f2937;
  border-color: #374151;
}

.dark .trending-item:hover {
  background: #374151;
  border-color: #3b82f6;
}

.dark .story-title {
  color: #f9fafb;
}

.dark .story-rank {
  color: #f87171;
}
</style>
