<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Rating from 'primevue/rating';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import Dialog from 'primevue/dialog';
import { useToast } from 'primevue/usetoast';
import { rateStory, updateRating, deleteRating, getMyRating, getStoryRatingInfo } from '@/api/rating';

const props = defineProps({
  storyId: {
    type: [Number, String],
    required: true
  }
});

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const myRating = ref(null);
const myRatingValue = ref(0);
const myReview = ref('');
const showRatingDialog = ref(false);
const loading = ref(false);

// Story rating info
const averageRating = ref(0);
const totalRatings = ref(0);

onMounted(async () => {
  await loadRatingInfo();
  if (authStore.isAuthenticated) {
    await loadMyRating();
  }
});

const loadRatingInfo = async () => {
  try {
    const response = await getStoryRatingInfo(props.storyId);
    const data = response.data.data;
    averageRating.value = data.averageRating || 0;
    totalRatings.value = data.totalRatings || 0;
  } catch (error) {
    console.error('Error loading rating info:', error);
  }
};

const loadMyRating = async () => {
  try {
    const response = await getMyRating(props.storyId);
    myRating.value = response.data.data;
    if (myRating.value) {
      myRatingValue.value = myRating.value.rating;
      myReview.value = myRating.value.review || '';
    }
  } catch (error) {
    // User hasn't rated yet
    myRating.value = null;
  }
};

const openRatingDialog = () => {
  if (!authStore.isAuthenticated) {
    toast.add({
      severity: 'warn',
      summary: 'Chưa đăng nhập',
      detail: 'Vui lòng đăng nhập để đánh giá',
      life: 3000
    });
    router.push('/login');
    return;
  }
  showRatingDialog.value = true;
};

const submitRating = async () => {
  if (myRatingValue.value === 0) {
    toast.add({
      severity: 'warn',
      summary: 'Thiếu thông tin',
      detail: 'Vui lòng chọn số sao',
      life: 3000
    });
    return;
  }

  try {
    loading.value = true;
    
    if (myRating.value) {
      // Update existing rating
      await updateRating(props.storyId, myRatingValue.value, myReview.value || null);
      toast.add({
        severity: 'success',
        summary: 'Đã cập nhật',
        detail: 'Cập nhật đánh giá thành công',
        life: 3000
      });
    } else {
      // Create new rating
      await rateStory(props.storyId, myRatingValue.value, myReview.value || null);
      toast.add({
        severity: 'success',
        summary: 'Đã đánh giá',
        detail: 'Đánh giá truyện thành công',
        life: 3000
      });
    }
    
    showRatingDialog.value = false;
    await loadRatingInfo();
    await loadMyRating();
  } catch (error) {
    console.error('Error submitting rating:', error);
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error.response?.data?.message || 'Không thể đánh giá',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const handleDeleteRating = async () => {
  try {
    await deleteRating(props.storyId);
    toast.add({
      severity: 'success',
      summary: 'Đã xóa',
      detail: 'Xóa đánh giá thành công',
      life: 3000
    });
    
    myRating.value = null;
    myRatingValue.value = 0;
    myReview.value = '';
    showRatingDialog.value = false;
    
    await loadRatingInfo();
  } catch (error) {
    console.error('Error deleting rating:', error);
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Không thể xóa đánh giá',
      life: 3000
    });
  }
};

const ratingText = computed(() => {
  if (myRating.value) {
    return 'Sửa đánh giá';
  }
  return 'Đánh giá';
});
</script>

<template>
  <div class="rating-section">
    <!-- Rating Display -->
    <div class="flex items-center gap-4 mb-4">
      <div class="text-center">
        <div class="text-4xl font-bold text-indigo-600">
          {{ averageRating.toFixed(1) }}
        </div>
        <Rating :modelValue="averageRating" readonly :cancel="false" class="text-yellow-500" />
        <div class="text-sm text-gray-500 mt-1">
          {{ totalRatings }} đánh giá
        </div>
      </div>
      
      <div class="flex-1">
        <Button
          @click="openRatingDialog"
          :label="ratingText"
          icon="pi pi-star"
          :outlined="!myRating"
          severity="warning"
        />
      </div>
    </div>

    <!-- My Rating Display -->
    <div v-if="myRating && !showRatingDialog" class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="font-semibold">Đánh giá của bạn:</span>
          <Rating :modelValue="myRating.rating" readonly :cancel="false" class="text-yellow-500" />
        </div>
      </div>
      <p v-if="myRating.review" class="text-gray-700 dark:text-gray-300">
        {{ myRating.review }}
      </p>
    </div>

    <!-- Rating Dialog -->
    <Dialog
      v-model:visible="showRatingDialog"
      modal
      header="Đánh giá truyện"
      :style="{ width: '500px' }"
    >
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Số sao</label>
          <Rating v-model="myRatingValue" :cancel="false" class="text-yellow-500 text-2xl" />
        </div>
        
        <div>
          <label class="block mb-2 font-semibold">Nhận xét (tùy chọn)</label>
          <Textarea
            v-model="myReview"
            rows="5"
            placeholder="Chia sẻ cảm nhận của bạn về truyện..."
            class="w-full"
          />
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-between">
          <Button
            v-if="myRating"
            @click="handleDeleteRating"
            label="Xóa đánh giá"
            icon="pi pi-trash"
            severity="danger"
            text
          />
          <div class="flex gap-2 ml-auto">
            <Button
              @click="showRatingDialog = false"
              label="Hủy"
              severity="secondary"
              outlined
            />
            <Button
              @click="submitRating"
              label="Gửi đánh giá"
              icon="pi pi-check"
              :loading="loading"
            />
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
</style>
