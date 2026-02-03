<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '@/components/common/Navbar.vue';
import Button from 'primevue/button';
import { getAuthorById } from '@/api/author';
import { getStoriesByAuthor } from '@/api/author';
import StoryCard from '@/components/common/StoryCard.vue';
import ProgressSpinner from 'primevue/progressspinner';

const route = useRoute();
const router = useRouter();
const author = ref(null);
const stories = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchAuthorData = async () => {
    loading.value = true;
    error.value = null;
    try {
        const authorId = route.params.id;
        if (!authorId || authorId === 'null') {
            error.value = 'ID tác giả không hợp lệ hoặc không tồn tại.';
            return;
        }
        const [authorRes, storiesRes] = await Promise.all([
            getAuthorById(authorId),
            getStoriesByAuthor(authorId)
        ]);
        
        author.value = authorRes.data.data;
        stories.value = storiesRes.data.data;
    } catch (err) {
        console.error('Error fetching author data:', err);
        error.value = 'Không thể tải thông tin tác giả. Vui lòng thử lại sau.';
    } finally {
        loading.value = false;
    }
};

const goBack = () => {
    router.back();
};

onMounted(() => {
    fetchAuthorData();
});
</script>

<template>
    <div class="min-h-screen bg-[#f1f5f9]">
        <Navbar />
        
        <div class="max-w-7xl mx-auto px-4 py-8">
            <div class="mb-6">
                <Button 
                    icon="pi pi-arrow-left" 
                    label="Quay lại" 
                    class="p-button-text !text-slate-600 hover:!text-indigo-600 !p-0"
                    @click="goBack"
                />
            </div>

            <div v-if="loading" class="flex justify-center items-center py-20">
                <ProgressSpinner />
            </div>

            <div v-else-if="error" class="text-center py-20 text-red-500">
                {{ error }}
            </div>

            <div v-else-if="author" class="space-y-8">
                <!-- Author Profile Header -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                    <div class="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-slate-50 shadow-md shrink-0">
                        <img 
                            :src="author.avatar || 'https://via.placeholder.com/200?text=Avatar'" 
                            :alt="author.name"
                            class="w-full h-full object-cover"
                        />
                    </div>
                    <div class="space-y-4 flex-1">
                        <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900">{{ author.name }}</h1>
                        <div class="prose prose-slate max-w-none">
                            <p class="text-slate-600 leading-relaxed whitespace-pre-line">
                                {{ author.bio || 'Chưa có thông tin giới thiệu về tác giả này.' }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Author's Stories -->
                <div>
                    <h2 class="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <i class="pi pi-book text-indigo-500"></i>
                        Truyện của {{ author.name }}
                    </h2>
                    
                    <div v-if="stories.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        <StoryCard 
                            v-for="story in stories" 
                            :key="story.id" 
                            :story="story" 
                        />
                    </div>
                    <div v-else class="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p class="text-slate-500 italic">Tác giả này chưa có truyện nào.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.prose p {
    margin-bottom: 0;
}
</style>
