<script setup>
// Component SearchBox - Ô tìm kiếm với gợi ý tự động (auto-suggest)
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getSearchSuggestions } from '@/api/searchAnalytics';
import InputText from 'primevue/inputtext';

const router = useRouter();
const searchKeyword = ref('');
const suggestions = ref([]);
const showSuggestions = ref(false);
const loading = ref(false);
let debounceTimeout = null;

// Debounce 300ms để tránh gọi API quá nhiều khi nhập liệu
watch(searchKeyword, (newValue) => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
  
  if (!newValue || newValue.trim().length < 2) {
    suggestions.value = [];
    showSuggestions.value = false;
    return;
  }
  
  debounceTimeout = setTimeout(async () => {
    await fetchSuggestions(newValue);
  }, 300);
});

// Lấy gợi ý từ API, xử lý nhiều dạng response có thể
const fetchSuggestions = async (query) => {
  try {
    loading.value = true;
    const response = await getSearchSuggestions(query, 5);
    
    // Xử lý response (có thể là mảng trực tiếp hoặc bọc trong {data})
    let suggestionData = [];
    if (response.data) {
      if (Array.isArray(response.data)) {
        suggestionData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        suggestionData = response.data.data;
      }
    }
    
    suggestions.value = suggestionData;
    showSuggestions.value = suggestionData.length > 0;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    suggestions.value = [];
    showSuggestions.value = false;
  } finally {
    loading.value = false;
  }
};

// Chuyển hướng đến trang kết quả tìm kiếm
const handleSearch = (query = null) => {
  const searchQuery = query || searchKeyword.value;
  if (searchQuery && searchQuery.trim()) {
    router.push({ name: 'Search', query: { q: searchQuery } });
    showSuggestions.value = false;
  }
};

const selectSuggestion = (suggestion) => {
  searchKeyword.value = suggestion;
  handleSearch(suggestion);
};

// Delay ẩn để cho phép click vào gợi ý trước khi dropdown biến mất
const hideSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};
</script>

<template>
  <div class="relative w-full">
    <div class="relative group">
      <InputText
        v-model="searchKeyword"
        @keyup.enter="handleSearch()"
        @focus="searchKeyword.length >= 2 && suggestions.length > 0 ? showSuggestions = true : null"
        @blur="hideSuggestions"
        placeholder="Tìm kiếm truyện..."
        class="w-full pl-10! rounded-2xl transition-all search-input"
      />
      <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"></i>
      
      <!-- Spinner khi đang tải gợi ý -->
      <i v-if="loading" class="pi pi-spin pi-spinner absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500"></i>
    </div>
    
    <!-- Dropdown gợi ý tự động -->
    <Transition name="dropdown">
      <div 
        v-if="showSuggestions && suggestions.length > 0"
        class="search-suggestions"
      >
        <div class="py-2">
          <button
            v-for="(suggestion, index) in suggestions"
            :key="index"
            @mousedown.prevent="selectSuggestion(suggestion)"
            class="suggestion-item"
          >
            <i class="pi pi-search text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"></i>
            <span class="text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 font-medium">
              {{ suggestion }}
            </span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.search-input {
    background: #f8fafc !important;
    border-color: #e2e8f0 !important;
    color: #1e293b !important;
}

.search-input:focus {
    background: #ffffff !important;
    border-color: #6366f1 !important;
}

.dark .search-input {
    background: #334155 !important;
    border-color: #475569 !important;
    color: #e2e8f0 !important;
}

.dark .search-input:focus {
    background: #1e293b !important;
    border-color: #818cf8 !important;
}

.search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.5rem;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    z-index: 100;
    overflow: hidden;
}

.dark .search-suggestions {
    background: #1e293b;
    border-color: #334155;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
}

.suggestion-item {
    width: 100%;
    padding: 0.75rem 1rem;
    text-align: left;
    transition: background 0.15s;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    background: transparent;
    border: none;
}

.suggestion-item:hover {
    background: #eef2ff;
}

.dark .suggestion-item:hover {
    background: #334155;
}

/* Hiệu ứng chuyển đổi dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
