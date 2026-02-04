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
import { PAGINATION } from '@/utils/constants';
import { formatRelativeDate } from '@/utils/formatters';
import { handleAuthRequired, showSuccessToast, showErrorToast, showWarningToast, extractData } from '@/utils/helpers';
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

import { usePagination } from '@/composables/usePagination';

const { totalRecords, currentPage, pageSize, onPageChange, resetPagination } = usePagination(PAGINATION.DEFAULT_PAGE_SIZE);

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
    
    const { content, total } = extractData(response);
    comments.value = content;
    totalRecords.value = total;
  } catch (error) {
    showErrorToast(toast, error, 'Không thể tải bình luận');
  } finally {
    loading.value = false;
  }
};

const handleSubmitComment = async () => {
  if (handleAuthRequired(authStore, router, toast, 'Vui lòng đăng nhập để bình luận')) return;

  if (!newCommentContent.value.trim()) {
    showWarningToast(toast, 'Thiếu nội dung', 'Vui lòng nhập nội dung bình luận');
    return;
  }

  try {
    submitting.value = true;
    await createComment(props.storyId, props.chapterId, newCommentContent.value);
    
    showSuccessToast(toast, 'Đã gửi', 'Bình luận thành công');
    
    newCommentContent.value = '';
    resetPagination();
    await loadComments();
  } catch (error) {
    showErrorToast(toast, error, 'Không thể gửi bình luận');
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
    showWarningToast(toast, 'Thiếu nội dung', 'Vui lòng nhập nội dung bình luận');
    return;
  }

  try {
    await updateComment(commentId, editingContent.value);
    
    showSuccessToast(toast, 'Đã cập nhật', 'Cập nhật bình luận thành công');
    
    editingCommentId.value = null;
    editingContent.value = '';
    await loadComments();
  } catch (error) {
    showErrorToast(toast, error, 'Không thể cập nhật bình luận');
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
        
        showSuccessToast(toast, 'Đã xóa', 'Xóa bình luận thành công');
        await loadComments();
      } catch (error) {
        showErrorToast(toast, error, 'Không thể xóa bình luận');
      }
    }
  });
};

const handlePageChange = (event) => onPageChange(event, loadComments);

const formatDate = (dateString) => formatRelativeDate(dateString);

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
          class="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700"
      >
        <div class="flex items-start gap-3">
          <Avatar
              :label="comment.username.charAt(0).toUpperCase()"
              shape="circle"
              class="bg-blue-600 text-white"
          />

          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <div>
          <span class="font-semibold text-gray-900 dark:text-white">
            {{ comment.username }}
          </span>
                <span class="text-sm text-gray-600 dark:text-gray-400 ml-2">
            {{ formatDate(comment.createdAt) }}
          </span>
                <span v-if="comment.updatedAt && comment.updatedAt !== comment.createdAt" class="text-xs text-gray-500 dark:text-gray-400 ml-1">
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
      @page="handlePageChange"
      template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      class="mt-6"
    />
  </div>
</template>

<style scoped>
</style>
