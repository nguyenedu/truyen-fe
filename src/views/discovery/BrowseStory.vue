<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUIStore } from '@/stores/ui';
import Navbar from '@/components/common/Navbar.vue';
import StoryCard from '@/components/common/StoryCard.vue';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import ProgressSpinner from 'primevue/progressspinner';
import Paginator from 'primevue/paginator';
import { PAGINATION } from '@/utils/constants';

import { usePagination } from '@/composables/usePagination';
import { useDiscovery } from '@/composables/useDiscovery';
import { filterStories } from '@/api/story';

const { 
  totalRecords, 
  currentPage, 
  pageSize, 
  onPageChange, 
  resetPagination 
} = usePagination(PAGINATION.BROWSE_PAGE_SIZE);

const {
  keyword,
  selectedStatus,
  selectedCategories,
  categoryOptions,
  selectedSort,
  minChapters,
  maxChapters,
  statusOptions,
  sortOptions,
  fetchCategories,
  resetFilters,
  getFilterParams
} = useDiscovery();

const uiStore = useUIStore();
const stories = ref([]);

onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    loadStories()
  ]);
});

watch([selectedStatus, selectedSort, selectedCategories], () => {
  resetPagination();
  loadStories();
});

const loadStories = async () => {
  try {
    uiStore.startLoading();
    const params = getFilterParams(currentPage.value, pageSize.value);
    const response = await filterStories(params);
    const data = response.data.data;
    
    stories.value = data.content || [];
    totalRecords.value = data.totalElements || 0;
  } catch (error) {
    console.error('Error loading stories:', error);
    stories.value = [];
    totalRecords.value = 0;
  } finally {
    uiStore.stopLoading();
  }
};

const handleSearch = () => {
  resetPagination();
  loadStories();
};

const handleReset = () => {
  resetFilters();
  resetPagination();
  loadStories();
};

const handlePageChange = (event) => {
  onPageChange(event, loadStories);
  window.scrollTo(0, 0);
};
</script>

<template>
  <div class="min-h-screen bg-[#f1f5f9]">
    <Navbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-4xl font-black text-slate-800 mb-8 tracking-tighter">
        <i class="pi pi-filter text-indigo-500 mr-2"></i>
        Tìm kiếm nâng cao
      </h1>
      
      <!-- Filter Panel -->
      <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <!-- Keyword Search -->
          <div>
            <label class="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
              Tìm kiếm
            </label>
            <InputText
              v-model="keyword"
              placeholder="Tên truyện..."
              class="w-full"
              @keyup.enter="handleSearch"
            />
          </div>
          
          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
              Trạng thái
            </label>
            <Dropdown
              v-model="selectedStatus"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Chọn trạng thái"
              class="w-full"
            />
          </div>

          <!-- Category Filter -->
          <div>
            <label class="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
              Thể loại
            </label>
            <MultiSelect
              v-model="selectedCategories"
              :options="categoryOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Chọn các thể loại"
              :maxSelectedLabels="2"
              class="w-full"
            />
          </div>

          <!-- Sort -->
          <div>
            <label class="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
              Sắp xếp
            </label>
            <Dropdown
              v-model="selectedSort"
              :options="sortOptions"
              optionLabel="label"
              placeholder="Chọn cách sắp xếp"
              class="w-full"
            />
          </div>
          
          <!-- Min Chapters -->
          <div>
            <label class="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
              Số chương tối thiểu
            </label>
            <InputNumber
              v-model="minChapters"
              placeholder="VD: 10"
              class="w-full"
              :min="0"
            />
          </div>
          
          <!-- Max Chapters -->
          <div>
            <label class="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
              Số chương tối đa
            </label>
            <InputNumber
              v-model="maxChapters"
              placeholder="VD: 100"
              class="w-full"
              :min="0"
            />
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-3">
          <Button
            @click="handleSearch"
            label="Tìm kiếm"
            icon="pi pi-search"
            class="!bg-indigo-600 hover:!bg-indigo-700"
          />
          <Button
            @click="handleReset"
            label="Đặt lại"
            icon="pi pi-refresh"
            severity="secondary"
            outlined
          />
        </div>
      </div>
      
      <!-- Results -->
      <div class="mb-6">
        <p class="text-slate-500 font-medium">
          Tìm thấy <span class="text-indigo-600 font-black">{{ totalRecords }}</span> truyện
        </p>
      </div>
      
      <!-- Loading -->
      <div v-if="uiStore.loading" class="flex justify-center py-20">
        <ProgressSpinner />
      </div>
      
      <!-- No Results -->
      <div v-else-if="stories.length === 0" class="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
        <i class="pi pi-inbox text-6xl text-slate-200 mb-4"></i>
        <p class="text-slate-400 font-medium">Không tìm thấy truyện nào</p>
      </div>
      
      <!-- Stories Grid -->
      <div v-else>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <StoryCard
            v-for="story in stories"
            :key="story.id"
            :story="story"
          />
        </div>
        
        <!-- Pagination -->
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
