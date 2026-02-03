<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';

const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const error = ref('');
const loading = ref(false);

const handleRegister = async () => {
  // Validation
  if (!formData.value.username || !formData.value.email || !formData.value.password) {
    error.value = 'Vui lòng nhập đầy đủ thông tin';
    return;
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'Mật khẩu xác nhận không khớp';
    return;
  }

  if (formData.value.password.length < 6) {
    error.value = 'Mật khẩu phải có ít nhất 6 ký tự';
    return;
  }

  error.value = '';
  loading.value = true;

  const result = await authStore.register({
    username: formData.value.username,
    email: formData.value.email,
    password: formData.value.password,
  });

  loading.value = false;

  if (result.success) {
    router.push({ name: 'Login' });
  } else {
    error.value = result.message;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#f1f5f9] p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-10">
        <!-- Header -->
        <div class="text-center mb-10">
          <h1 class="text-4xl font-black text-slate-800 mb-2 tracking-tighter">Đăng ký</h1>
          <p class="text-slate-500 font-medium">Tạo tài khoản để bắt đầu đọc truyện</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Username -->
          <div class="flex flex-col gap-2">
            <label for="username" class="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Tên đăng nhập
            </label>
            <InputText
              id="username"
              v-model="formData.username"
              placeholder="Nhập tên đăng nhập"
              :disabled="loading"
              autocomplete="username"
              class="w-full"
            />
          </div>

          <!-- Email -->
          <div class="flex flex-col gap-2">
            <label for="email" class="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Email
            </label>
            <InputText
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="Nhập email"
              :disabled="loading"
              autocomplete="email"
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
              v-model="formData.password"
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
              :disabled="loading"
              toggleMask
              :feedback="true"
              autocomplete="new-password"
              class="w-full"
            />
          </div>

          <!-- Confirm Password -->
          <div class="flex flex-col gap-2">
            <label for="confirmPassword" class="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Xác nhận mật khẩu
            </label>
            <Password
              id="confirmPassword"
              v-model="formData.confirmPassword"
              placeholder="Nhập lại mật khẩu"
              :disabled="loading"
              :feedback="false"
              toggleMask
              autocomplete="new-password"
              class="w-full"
            />
          </div>

          <!-- Error Message -->
          <Message v-if="error" severity="error" :closable="false">
            {{ error }}
          </Message>

          <!-- Submit Button -->
          <Button
            type="submit"
            :label="loading ? 'Đang đăng ký...' : 'Đăng ký'"
            :loading="loading"
            :disabled="loading"
            class="w-full"
            size="large"
          />
        </form>

        <!-- Footer -->
        <div class="mt-8 text-center">
          <p class="text-slate-500 font-medium">
            Đã có tài khoản? 
            <router-link to="/login" class="font-bold text-indigo-600 hover:text-indigo-700">
              Đăng nhập ngay
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
