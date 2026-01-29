import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { loginApi, registerApi, logoutApi } from '@/api/auth';

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref(null);
    const token = ref(null);

    // Getters
    const isAuthenticated = computed(() => !!token.value);
    const isAdmin = computed(() => {
        return user.value?.role === 'ADMIN' || user.value?.role === 'SUPER_ADMIN';
    });

    // Actions
    const login = async (username, password) => {
        try {
            const response = await loginApi(username, password);
            const data = response.data.data;

            // Lưu token và user info
            token.value = data.token;
            user.value = data.user;

            // Persist vào localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return { success: true, data };
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Đăng nhập thất bại'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await registerApi(userData);
            return { success: true, message: response.data.message };
        } catch (error) {
            console.error('Register failed:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Đăng ký thất bại'
            };
        }
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear state
            token.value = null;
            user.value = null;

            // Clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    };

    const checkAuth = () => {
        // Khôi phục auth state từ localStorage
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            token.value = savedToken;
            user.value = JSON.parse(savedUser);
        }
    };

    return {
        user,
        token,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        checkAuth,
    };
});
