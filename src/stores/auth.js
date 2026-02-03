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

            console.log('📥 Login response:', data);

            token.value = data.token;
            user.value = {
                id: data.userId,
                username: data.username,
                email: data.email,
                role: data.role
            };

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(user.value));

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

            token.value = null;
            user.value = null;


            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    };

    const checkAuth = () => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
            try {
                user.value = JSON.parse(savedUser);
                console.log('✅ User restored:', user.value);
            } catch (error) {
                console.error('Failed to parse user data from localStorage:', error);
                localStorage.removeItem('user');
            }
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
