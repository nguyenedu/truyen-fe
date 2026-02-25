// Composable xác thực - Cung cấp các hàm xác thực dùng chung cho components
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { handleAuthRequired } from '@/utils/helpers';

export const useAuth = () => {
    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();
    const toast = useToast();

    // Kiểm tra đăng nhập, chuyển hướng nếu chưa xác thực
    const requireAuth = (message = 'Vui lòng đăng nhập để tiếp tục') => {
        return handleAuthRequired(authStore, router, toast, message);
    };

    // Đăng xuất và chuyển hướng
    const logout = async (redirectPath = '/') => {
        await authStore.logout();
        router.replace(redirectPath);
    };

    // Đăng nhập và chuyển hướng về trang trước đó (nếu có)
    const loginAndRedirect = async (username, password) => {
        const result = await authStore.login(username, password);
        if (result.success) {
            const redirect = route.query.redirect || '/';
            router.push(redirect);
        }
        return result;
    };

    return {
        user: authStore.user,
        isAuthenticated: authStore.isAuthenticated,
        requireAuth,
        logout,
        loginAndRedirect
    };
};
