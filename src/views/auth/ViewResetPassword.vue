<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useUIStore } from '@/stores/ui';
import { resetPasswordApi } from '@/api/auth';
import { showErrorToast, showSuccessToast } from '@/utils/helpers';
import { ERROR_MESSAGES } from '@/utils/errors';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const uiStore = useUIStore();

const token = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const error = ref('');

onMounted(() => {
    token.value = route.query.token;
    if (!token.value) {
        error.value = 'Mã khôi phục không hợp lệ hoặc đã hết hạn';
    }
});

const handleResetPassword = async () => {
    if (!newPassword.value) {
        error.value = 'Vui lòng nhập mật khẩu mới';
        return;
    }
    
    if (newPassword.value.length < 6) {
        error.value = 'Mật khẩu phải có ít nhất 6 ký tự';
        return;
    }
    
    if (newPassword.value !== confirmPassword.value) {
        error.value = 'Mật khẩu xác nhận không khớp';
        return;
    }
    
    try {
        uiStore.startLoading();
        error.value = '';
        
        await resetPasswordApi(token.value, newPassword.value);
        
        showSuccessToast(toast, 'Thành công', 'Mật khẩu của bạn đã được cập nhật');
        setTimeout(() => {
            router.push('/login');
        }, 2000);
    } catch (err) {
        showErrorToast(toast, err, 'Lỗi cập nhật mật khẩu');
    } finally {
        uiStore.stopLoading();
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
            <div class="text-center">
                <h2 class="text-3xl font-black text-slate-900 tracking-tight">Đặt lại mật khẩu</h2>
                <p class="mt-2 text-sm text-slate-600">
                    Vui lòng nhập mật khẩu mới cho tài khoản của bạn
                </p>
            </div>

            <form v-if="token" class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
                <div class="space-y-4">
                    <div class="flex flex-col gap-2">
                        <label for="newPassword" class="text-sm font-bold text-slate-700">Mật khẩu mới</label>
                        <Password
                            id="newPassword"
                            v-model="newPassword"
                            placeholder="Nhập mật khẩu mới"
                            toggleMask
                            class="w-full"
                            inputClass="w-full"
                            :feedback="true"
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="confirmPassword" class="text-sm font-bold text-slate-700">Xác nhận mật khẩu mới</label>
                        <InputText
                            id="confirmPassword"
                            v-model="confirmPassword"
                            type="password"
                            placeholder="Nhập lại mật khẩu mới"
                            class="w-full"
                        />
                    </div>
                </div>

                <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>

                <div>
                    <Button
                        type="submit"
                        label="Cập nhật mật khẩu"
                        icon="pi pi-save"
                        class="w-full !bg-indigo-600 hover:!bg-indigo-700"
                        :loading="uiStore.loading"
                    />
                </div>
            </form>

            <div v-else class="mt-8 space-y-6">
                <Message severity="error" :closable="false">
                    Link khôi phục đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu lại.
                </Message>
                <Button
                    label="Quay lại trang quên mật khẩu"
                    outlined
                    class="w-full"
                    @click="router.push('/forgot-password')"
                />
            </div>
        </div>
    </div>
</template>
