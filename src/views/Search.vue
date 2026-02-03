<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/common/Navbar.vue';
import StoryCard from '@/components/common/StoryCard.vue';
import ProgressSpinner from 'primevue/progressspinner';
import Paginator from 'primevue/paginator';
import { searchStories } from '@/api/story';

const route = useRoute();
const stories = ref([]);
const loading = ref(true);
const keyword = ref('');
const totalRecords = ref(0);
const currentPage = ref(0);
const pageSize = ref(12);

onMounted(async () => {
  keyword.value = route.query.q || '';
  if (keyword.value) {
    await performSearch();
  } else {
    loading.value = false;
  }
});

// Watch for query changes
watch(() => route.query.q, (newKeyword) => {
  keyword.value = newKeyword || '';
  if (keyword.value) {
    currentPage.value = 0;
    performSearch();
  }
});

const performSearch = async () => {
  try {
    loading.value = true;
    const response = await searchStories(keyword.value, currentPage.value, pageSize.value);
    const data = response.data.data;
    
    stories.value = data.content || [];
    totalRecords.value = data.totalElements || 0;
  } catch (error) {
    console.error('Search error:', error);
    stories.value = [];
    totalRecords.value = 0;
  } finally {
    loading.value = false;
  }
};

const onPageChange = (event) => {
  currentPage.value = event.page;
  performSearch();
  window.scrollTo(0, 0);
};
</script>

<template>
  <div class="min-h-screen bg-[#f1f5f9]">
    <Navbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8 p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
        <h1 class="text-3xl font-black text-slate-800 mb-2 tracking-tighter">
          Kết quả tìm kiếm: "{{ keyword }}"
        </h1>
        <p v-if="!loading && totalRecords > 0" class="text-slate-500 font-medium">
          Tìm thấy <span class="text-indigo-600 font-black">{{ totalRecords }}</span> truyện
        </p>
      </div>
      
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <ProgressSpinner />
        <p class="mt-4 text-slate-500 font-medium">Đang tìm kiếm...</p>
      </div>
      
      <div v-else-if="!keyword" class="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
        <i class="pi pi-search text-6xl text-slate-200 mb-4"></i>
        <p class="text-slate-400 font-medium">Nhập từ khóa để tìm kiếm truyện</p>
      </div>
      
      <div v-else-if="stories.length === 0" class="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
        <i class="pi pi-search text-6xl text-slate-200 mb-4"></i>
        <h2 class="text-xl font-black text-slate-800 mb-2">
          Không tìm thấy kết quả
        </h2>
        <p class="text-slate-400 font-medium">
          Không tìm thấy truyện nào với từ khóa "{{ keyword }}"
        </p>
      </div>
      
      <div v-else>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <StoryCard
            v-for="story in stories"
            :key="story.id"
            :story="story"
          />
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
