import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { checkFavorite, addFavorite, removeFavorite, getFavoriteCount } from '@/api/favorite';
import { handleAuthRequired, showSuccessToast, showErrorToast } from '@/utils/helpers';

export const useFavorite = () => {
    const authStore = useAuthStore();
    const router = useRouter();
    const toast = useToast();

    const isFavorited = ref(false);
    const favoriteCount = ref(0);
    const loading = ref(false);

    const loadStatus = async (storyId) => {
        if (!authStore.isAuthenticated || !storyId) return;

        try {
            const [statusRes, countRes] = await Promise.all([
                checkFavorite(storyId),
                getFavoriteCount(storyId)
            ]);

            isFavorited.value = statusRes.data.data;
            favoriteCount.value = countRes.data.data;
        } catch (error) {
            console.error('Error loading favorite status:', error);
        }
    };

    const toggleFavoriteStatus = async (storyId) => {
        if (handleAuthRequired(authStore, router, toast, 'Vui lòng đăng nhập để thêm vào yêu thích')) return;

        if (!storyId) return;

        try {
            loading.value = true;

            if (isFavorited.value) {
                await removeFavorite(storyId);
                isFavorited.value = false;
                favoriteCount.value = Math.max(0, favoriteCount.value - 1);
                showSuccessToast(toast, 'Đã xóa', 'Đã xóa khỏi danh sách yêu thích');
            } else {
                await addFavorite(storyId);
                isFavorited.value = true;
                favoriteCount.value += 1;
                showSuccessToast(toast, 'Đã thêm', 'Đã thêm vào danh sách yêu thích');
            }
        } catch (error) {
            showErrorToast(toast, error, 'Có lỗi xảy ra khi cập nhật yêu thích');
        } finally {
            loading.value = false;
        }
    };

    return {
        isFavorited,
        favoriteCount,
        loading,
        loadStatus,
        toggleFavoriteStatus
    };
};
