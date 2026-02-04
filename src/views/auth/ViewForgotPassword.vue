<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useUIStore } from '@/stores/ui';
import { forgotPasswordApi } from '@/api/auth';
import { showErrorToast, showSuccessToast } from '@/utils/helpers';
import { ERROR_MESSAGES } from '@/utils/errors';
import emailjs from '@emailjs/browser';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';

const router = useRouter();
const toast = useToast();
const uiStore = useUIStore();

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

const email = ref('');
const submitted = ref(false);
const error = ref('');

const handleForgotPassword = async () => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!email.value) {
        error.value = 'Vui lòng nhập email';
        return;
    }

    if (!serviceId || !templateId || !publicKey) {
        error.value = 'Thiếu cấu hình EmailJS. Vui lòng kiểm tra file .env';
        console.error('EmailJS Config missing:', { serviceId, templateId, publicKey });
        return;
    }
    
    try {
        uiStore.startLoading();
        error.value = '';
        
        const response = await forgotPasswordApi(email.value);
        const resetToken = response.data.data;
        
        // Gửi email qua EmailJS
        const templateParams = {
            to_email: email.value,
            user_email: email.value,
            email: email.value,
            reset_link: `${window.location.origin}/reset-password?token=${resetToken}`
        };
        
        console.log('Sending email with params:', templateParams);

        await emailjs.send(
            serviceId,
            templateId,
            templateParams,
            publicKey
        );
        
        submitted.value = true;
        showSuccessToast(toast, 'Thành công', 'Link khôi phục mật khẩu đã được gửi đến email của bạn');
    } catch (err) {
        console.error('Forgot password error detail:', err);
        const errorMsg = err?.text || err?.message || 'Không thể gửi email khôi phục';
        showErrorToast(toast, err, errorMsg);
    } finally {
        uiStore.stopLoading();
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
            <div class="text-center">
                <h2 class="text-3xl font-black text-slate-900 tracking-tight">Quên mật khẩu</h2>
                <p class="mt-2 text-sm text-slate-600">
                    Nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu
                </p>
            </div>

            <div v-if="!submitted">
                <form class="mt-8 space-y-6" @submit.prevent="handleForgotPassword">
                    <div class="rounded-md shadow-sm space-y-4">
                        <div class="flex flex-col gap-2">
                            <label for="email" class="text-sm font-bold text-slate-700">Email</label>
                            <InputText
                                id="email"
                                v-model="email"
                                type="email"
                                placeholder="name@example.com"
                                class="w-full"
                                :class="{ 'p-invalid': error }"
                            />
                        </div>
                    </div>

                    <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>

                    <div>
                        <Button
                            type="submit"
                            label="Gửi yêu cầu"
                            icon="pi pi-envelope"
                            class="w-full !bg-indigo-600 hover:!bg-indigo-700"
                            :loading="uiStore.loading"
                        />
                    </div>

                    <div class="text-center">
                        <router-link to="/login" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            Quay lại đăng nhập
                        </router-link>
                    </div>
                </form>
            </div>

            <div v-else class="text-center space-y-6 mt-8">
                <div class="flex justify-center">
                    <div class="bg-green-100 p-3 rounded-full">
                        <i class="pi pi-check text-green-600 text-3xl"></i>
                    </div>
                </div>
                <div class="space-y-2">
                    <p class="text-lg font-bold text-slate-900">Kiểm tra email của bạn</p>
                    <p class="text-slate-600 text-sm">
                        Chúng tôi đã gửi link khôi phục mật khẩu đến <strong>{{ email }}</strong>. 
                        Vui lòng kiểm tra hộp thư (bao gồm cả thư rác).
                    </p>
                </div>
                <Button
                    label="Quay lại đăng nhập"
                    link
                    @click="router.push('/login')"
                    class="!text-indigo-600 font-bold"
                />
            </div>
        </div>
    </div>
</template>
