<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '@/components/common/Navbar.vue';
import StoryCard from '@/components/common/StoryCard.vue';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import ProgressSpinner from 'primevue/progressspinner';
import Paginator from 'primevue/paginator';
import { filterStories } from '@/api/story';
import { getCategories } from '@/api/category';

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
const selectedCategories = ref([]);
const categoryOptions = ref([]);
const selectedSort = ref({ label: 'Mới nhất', value: 'createdAt,desc' });
const minChapters = ref(null);
const maxChapters = ref(null);

const statusOptions = [
  { label: 'Tất cả', value: null },
  { label: 'Đang tiến hành', value: 'ONGOING' },
  { label: 'Hoàn thành', value: 'COMPLETED' },
  { label: 'Tạm dừng', value: 'PAUSED' }
];


onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    loadStories()
  ]);
});

const fetchCategories = async () => {
    try {
        const response = await getCategories(0, 50);
        const data = response.data.data;
        // The backend returns a List directly, not a Page with .content
        const categoryList = Array.isArray(data) ? data : (data.content || []);
        categoryOptions.value = categoryList.map(c => ({
            label: c.name,
            value: c.id
        }));
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

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

watch([selectedStatus, selectedSort, selectedCategories], () => {
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
    if (selectedCategories.value && selectedCategories.value.length > 0) {
        filters.categoryIds = selectedCategories.value;
    }
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
  selectedCategories.value = [];
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
      <div v-if="loading" class="flex justify-center py-20">
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
          @page="onPageChange"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        />
      </div>
    </div>
  </div>
</template>
