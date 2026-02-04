import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { handleAuthRequired } from '@/utils/helpers';

export const useAuth = () => {
    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();
    const toast = useToast();

    const requireAuth = (message = 'Vui lòng đăng nhập để tiếp tục') => {
        return handleAuthRequired(authStore, router, toast, message);
    };

    const logout = async (redirectPath = '/') => {
        await authStore.logout();
        router.replace(redirectPath);
    };

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
