<script setup>
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

// Debounce search để không gọi API quá nhiều
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
  }, 300); // Đợi 300ms sau khi user ngừng gõ
});

const fetchSuggestions = async (query) => {
  try {
    loading.value = true;
    const response = await getSearchSuggestions(query, 5);
    
    // Xử lý response từ backend (có thể là {success, message, data})
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
        class="w-full !pl-10 !bg-slate-50 !border-slate-200 !text-slate-800 focus:!bg-white focus:!border-indigo-500 rounded-2xl transition-all"
      />
      <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
      
      <!-- Loading spinner -->
      <i v-if="loading" class="pi pi-spin pi-spinner absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500"></i>
    </div>
    
    <!-- Auto-suggest Dropdown -->
    <Transition name="dropdown">
      <div 
        v-if="showSuggestions && suggestions.length > 0"
        class="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-[100] overflow-hidden"
      >
        <div class="py-2">
          <button
            v-for="(suggestion, index) in suggestions"
            :key="index"
            @mousedown.prevent="selectSuggestion(suggestion)"
            class="w-full px-4 py-3 text-left hover:bg-indigo-50 transition-colors flex items-center gap-3 group"
          >
            <i class="pi pi-search text-slate-400 group-hover:text-indigo-600 transition-colors"></i>
            <span class="text-slate-700 group-hover:text-indigo-600 font-medium">
              {{ suggestion }}
            </span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Dropdown Transition */
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
