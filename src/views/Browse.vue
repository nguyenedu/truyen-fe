<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '@/components/common/Navbar.vue';
import StoryCard from '@/components/common/StoryCard.vue';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import ProgressSpinner from 'primevue/progressspinner';
import Paginator from 'primevue/paginator';
import { filterStories } from '@/api/story';

const route = useRoute();
const router = useRouter();

const stories = ref([]);
const loading = ref(true);
const totalRecords = ref(0);
const currentPage = ref(0);
const pageSize = ref(24);

// Filter options
const keyword = ref('');
const selectedStatus = ref(null);
const selectedCategory = ref(null);
const selectedSort = ref({ label: 'Mới nhất', value: 'createdAt,desc' });
const minChapters = ref(null);
const maxChapters = ref(null);

const statusOptions = [
  { label: 'Tất cả', value: null },
  { label: 'Đang tiến hành', value: 'ONGOING' },
  { label: 'Hoàn thành', value: 'COMPLETED' },
  { label: 'Tạm dừng', value: 'PAUSED' }
];

const categoryOptions = [
  { label: 'Tiên Hiệp', value: 'Tiên Hiệp' },
  { label: 'Huyền Huyễn', value: 'Huyền Huyễn' },
  { label: 'Đô Thị', value: 'Đô Thị' },
  { label: 'Kiếm Hiệp', value: 'Kiếm Hiệp' },
  { label: 'Ngôn Tình', value: 'Ngôn Tình' },
  { label: 'Trinh Thám', value: 'Trinh Thám' },
  { label: 'Khoa Huyễn', value: 'Khoa Huyễn' },
  { label: 'Đam Mỹ', value: 'Đam Mỹ' },
  { label: 'Trọng Sinh', value: 'Trọng Sinh' },
  { label: 'Hệ Thống', value: 'Hệ Thống' },
  { label: 'Võ Hiệp', value: 'Võ Hiệp'}
];

const sortOptions = [
  { label: 'Mới nhất', value: 'createdAt,desc' },
  { label: 'Cũ nhất', value: 'createdAt,asc' },
  { label: 'Hot nhất (lượt xem)', value: 'totalViews,desc' },
  { label: 'Nhiều chương nhất', value: 'totalChapters,desc' },
  { label: 'Ít chương nhất', value: 'totalChapters,asc' },
  { label: 'A-Z', value: 'title,asc' },
  { label: 'Z-A', value: 'title,desc' }
];

onMounted(async () => {
  await loadStories();
});

watch([selectedStatus, selectedSort, selectedCategory], () => {
  currentPage.value = 0;
  loadStories();
});

const loadStories = async () => {
  try {
    loading.value = true;
    
    const filters = {
      page: currentPage.value,
      size: pageSize.value,
      sort: selectedSort.value?.value || 'createdAt,desc'
    };
    
    if (keyword.value) filters.keyword = keyword.value;
    if (selectedStatus.value) filters.status = selectedStatus.value;
    if (selectedCategory.value) filters.category = selectedCategory.value;
    if (minChapters.value) filters.minChapters = minChapters.value;
    if (maxChapters.value) filters.maxChapters = maxChapters.value;
    
    const response = await filterStories(filters);
    const data = response.data.data;
    
    stories.value = data.content || [];
    totalRecords.value = data.totalElements || 0;
  } catch (error) {
    console.error('Error loading stories:', error);
    stories.value = [];
    totalRecords.value = 0;
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 0;
  loadStories();
};

const handleReset = () => {
  keyword.value = '';
  selectedStatus.value = null;
  selectedCategory.value = null;
  selectedSort.value = { label: 'Mới nhất', value: 'createdAt,desc' };
  minChapters.value = null;
  maxChapters.value = null;
  currentPage.value = 0;
  loadStories();
};

const onPageChange = (event) => {
  currentPage.value = event.page;
  loadStories();
  window.scrollTo(0, 0);
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        <i class="pi pi-filter text-indigo-500"></i>
        Tìm kiếm nâng cao
      </h1>
      
      <!-- Filter Panel -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <!-- Keyword Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thể loại
            </label>
            <Dropdown
              v-model="selectedCategory"
              :options="categoryOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Chọn thể loại"
              class="w-full"
            />
          </div>

          <!-- Sort -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
      <div class="mb-4">
        <p class="text-gray-600 dark:text-gray-400">
          Tìm thấy <span class="font-bold text-indigo-600">{{ totalRecords }}</span> truyện
        </p>
      </div>
      
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <ProgressSpinner />
      </div>
      
      <!-- No Results -->
      <div v-else-if="stories.length === 0" class="text-center py-20">
        <i class="pi pi-inbox text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-600 dark:text-gray-400">Không tìm thấy truyện nào</p>
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
          @page="onPageChange"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        />
      </div>
    </div>
  </div>
</template>
