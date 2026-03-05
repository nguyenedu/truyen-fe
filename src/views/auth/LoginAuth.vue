<script setup>
// Trang đăng nhập - Xác thực người dùng và chuyển hướng
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { useToast } from 'primevue/usetoast';
import { showErrorToast } from '@/utils/helpers';
import { ERROR_MESSAGES } from '@/utils/errors';
import { isRequired } from '@/utils/validation';
import { useAuth } from '@/composables/useAuth';

const route = useRoute();
const toast = useToast();
const { loginAndRedirect } = useAuth();

const username = ref('');
const password = ref('');
const error = ref('');
const submitting = ref(false);

// Hiện banner nếu bị redirect do token hết hạn
const isExpired = computed(() => route.query.expired === '1');

const handleLogin = async () => {
  if (!isRequired(username.value) || !isRequired(password.value)) {
    error.value = 'Vui lòng nhập đầy đủ thông tin';
    return;
  }

  error.value = '';
  
  try {
    submitting.value = true;
    const result = await loginAndRedirect(username.value, password.value);
    
    if (!result.success) {
      error.value = result.message;
    }
  } catch (err) {
    showErrorToast(toast, err, ERROR_MESSAGES.LOGIN_FAILED);
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#f1f5f9] p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-10">
        <!-- Header -->
        <!-- Banner phiên hết hạn -->
        <Message v-if="isExpired" severity="warn" :closable="false" class="mb-6 rounded-xl">
          ⏳ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.
        </Message>

        <div class="text-center mb-10">
          <h1 class="text-4xl font-black text-slate-800 mb-2 tracking-tighter">Đăng nhập</h1>
          <p class="text-slate-500 font-medium">Đăng nhập để tiếp tục đọc truyện</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Username -->
          <div class="flex flex-col gap-2">
            <label for="username" class="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Tên đăng nhập
            </label>
            <InputText
              id="username"
              v-model="username"
              placeholder="Nhập tên đăng nhập"
              :disabled="loading"
              autocomplete="username"
              class="w-full"
            />
          </div>

          <!-- Password -->
          <div class="flex flex-col gap-2">
            <label for="password" class="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Mật khẩu
            </label>
            <Password
              id="password"
              v-model="password"
              placeholder="Nhập mật khẩu"
              :disabled="loading"
              :feedback="false"
              toggleMask
              autocomplete="current-password"
              class="w-full"
            />
            <div class="flex justify-end mt-1">
              <router-link to="/forgot-password" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Quên mật khẩu?
              </router-link>
            </div>
          </div>

          <!-- Error Message -->
          <Message v-if="error" severity="error" :closable="false">
            {{ error }}
          </Message>

          <!-- Submit Button -->
          <Button
            type="submit"
            :label="submitting ? 'Đang đăng nhập...' : 'Đăng nhập'"
            :loading="submitting"
            :disabled="submitting"
            class="w-full"
            size="large"
          />
        </form>

        <!-- Footer -->
        <div class="mt-8 text-center">
          <p class="text-slate-500 font-medium">
            Chưa có tài khoản? 
            <router-link to="/register" class="font-bold text-indigo-600 hover:text-indigo-700">
              Đăng ký ngay
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
