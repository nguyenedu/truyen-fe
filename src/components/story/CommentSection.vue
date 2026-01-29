<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import Avatar from 'primevue/avatar';
import Paginator from 'primevue/paginator';
import ProgressSpinner from 'primevue/progressspinner';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { getStoryComments, getChapterComments, createComment, updateComment, deleteComment } from '@/api/comment';

const props = defineProps({
  storyId: {
    type: [Number, String],
    default: null
  },
  chapterId: {
    type: [Number, String],
    default: null
  }
});

const authStore = useAuthStore();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

const comments = ref([]);
const loading = ref(true);
const newCommentContent = ref('');
const editingCommentId = ref(null);
const editingContent = ref('');
const submitting = ref(false);

const totalRecords = ref(0);
const currentPage = ref(0);
const pageSize = ref(10);

onMounted(async () => {
  await loadComments();
});

const loadComments = async () => {
  try {
    loading.value = true;
    let response;
    
    if (props.chapterId) {
      response = await getChapterComments(props.chapterId, currentPage.value, pageSize.value);
    } else if (props.storyId) {
      response = await getStoryComments(props.storyId, currentPage.value, pageSize.value);
    }
    
    const data = response.data.data;
    comments.value = data.content || [];
    totalRecords.value = data.totalElements || 0;
  } catch (error) {
    console.error('Error loading comments:', error);
  } finally {
    loading.value = false;
  }
};

const handleSubmitComment = async () => {
  if (!authStore.isAuthenticated) {
    toast.add({
      severity: 'warn',
      summary: 'Chưa đăng nhập',
      detail: 'Vui lòng đăng nhập để bình luận',
      life: 3000
    });
    router.push('/login');
    return;
  }

  if (!newCommentContent.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: 'Thiếu nội dung',
      detail: 'Vui lòng nhập nội dung bình luận',
      life: 3000
    });
    return;
  }

  try {
    submitting.value = true;
    await createComment(props.storyId, props.chapterId, newCommentContent.value);
    
    toast.add({
      severity: 'success',
      summary: 'Đã gửi',
      detail: 'Bình luận thành công',
      life: 3000
    });
    
    newCommentContent.value = '';
    currentPage.value = 0;
    await loadComments();
  } catch (error) {
    console.error('Error creating comment:', error);
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error.response?.data?.message || 'Không thể gửi bình luận',
      life: 3000
    });
  } finally {
    submitting.value = false;
  }
};

const startEdit = (comment) => {
  editingCommentId.value = comment.id;
  editingContent.value = comment.content;
};

const cancelEdit = () => {
  editingCommentId.value = null;
  editingContent.value = '';
};

const handleUpdateComment = async (commentId) => {
  if (!editingContent.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: 'Thiếu nội dung',
      detail: 'Vui lòng nhập nội dung bình luận',
      life: 3000
    });
    return;
  }

  try {
    await updateComment(commentId, editingContent.value);
    
    toast.add({
      severity: 'success',
      summary: 'Đã cập nhật',
      detail: 'Cập nhật bình luận thành công',
      life: 3000
    });
    
    editingCommentId.value = null;
    editingContent.value = '';
    await loadComments();
  } catch (error) {
    console.error('Error updating comment:', error);
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Không thể cập nhật bình luận',
      life: 3000
    });
  }
};

const handleDeleteComment = (commentId) => {
  confirm.require({
    message: 'Xóa bình luận này?',
    header: 'Xác nhận xóa',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Xóa',
    rejectLabel: 'Hủy',
    accept: async () => {
      try {
        await deleteComment(commentId);
        
        toast.add({
          severity: 'success',
          summary: 'Đã xóa',
          detail: 'Xóa bình luận thành công',
          life: 3000
        });
        
        await loadComments();
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể xóa bình luận',
          life: 3000
        });
      }
    }
  });
};

const onPageChange = (event) => {
  currentPage.value = event.page;
  loadComments();
  window.scrollTo(0, 0);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  return date.toLocaleDateString('vi-VN');
};

const isMyComment = (comment) => {
  return authStore.user && comment.userId === authStore.user.id;
};
</script>

<template>
  <div class="comment-section">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Bình luận ({{ totalRecords }})
    </h2>

    <!-- New Comment Form -->
    <div class="mb-8">
      <Textarea
        v-model="newCommentContent"
        rows="4"
        placeholder="Viết bình luận của bạn..."
        class="w-full mb-3"
      />
      <Button
        @click="handleSubmitComment"
        label="Gửi bình luận"
        icon="pi pi-send"
        :loading="submitting"
      />
    </div>

    <!-- Comments List -->
    <div v-if="loading" class="flex justify-center py-10">
      <ProgressSpinner />
    </div>

    <div v-else-if="comments.length === 0" class="text-center py-10 text-gray-500">
      <i class="pi pi-comments text-4xl mb-3"></i>
      <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-start gap-3">
          <Avatar
            :label="comment.username.charAt(0).toUpperCase()"
            shape="circle"
            class="bg-indigo-600 text-white"
          />
          
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <div>
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ comment.username }}
                </span>
                <span class="text-sm text-gray-500 ml-2">
                  {{ formatDate(comment.createdAt) }}
                </span>
                <span v-if="comment.updatedAt && comment.updatedAt !== comment.createdAt" class="text-xs text-gray-400 ml-1">
                  (đã sửa)
                </span>
              </div>
              
              <div v-if="isMyComment(comment)" class="flex gap-2">
                <Button
                  v-if="editingCommentId !== comment.id"
                  @click="startEdit(comment)"
                  icon="pi pi-pencil"
                  text
                  rounded
                  size="small"
                />
                <Button
                  @click="handleDeleteComment(comment.id)"
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  rounded
                  size="small"
                />
              </div>
            </div>
            
            <!-- Edit Mode -->
            <div v-if="editingCommentId === comment.id" class="space-y-2">
              <Textarea
                v-model="editingContent"
                rows="3"
                class="w-full"
              />
              <div class="flex gap-2">
                <Button
                  @click="handleUpdateComment(comment.id)"
                  label="Lưu"
                  icon="pi pi-check"
                  size="small"
                />
                <Button
                  @click="cancelEdit"
                  label="Hủy"
                  severity="secondary"
                  outlined
                  size="small"
                />
              </div>
            </div>
            
            <!-- View Mode -->
            <p v-else class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {{ comment.content }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <Paginator
      v-if="totalRecords > pageSize"
      :rows="pageSize"
      :totalRecords="totalRecords"
      :first="currentPage * pageSize"
      @page="onPageChange"
      template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      class="mt-6"
    />
  </div>
</template>

<style scoped>
/* Custom styles */
</style>
