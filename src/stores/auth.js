// Store xác thực - Quản lý trạng thái đăng nhập, thông tin user, và phiên làm việc
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { loginApi, registerApi, logoutApi, updateUserApi, getCurrentUserApi } from '@/api/auth';

export const useAuthStore = defineStore('auth', () => {

    // === State ===
    const user = ref(null);
    const token = ref(null);

    // === Getters ===
    const isAuthenticated = computed(() => !!token.value);
    const isAdmin = computed(() => {
        return user.value?.role === 'ADMIN' || user.value?.role === 'SUPER_ADMIN';
    });

    // === Actions ===

    // Đăng nhập và lưu thông tin vào localStorage
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
                fullname: data.fullname,
                avatar: data.avatar,
                role: data.role,
                phone: data.phone,
                createdAt: data.createdAt
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

    // Đăng ký tài khoản mới
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

    // Cập nhật hồ sơ và đồng bộ localStorage
    const updateProfile = async (id, formData) => {
        try {
            const response = await updateUserApi(id, formData);
            const updatedUser = response.data.data;

            user.value = {
                ...user.value,
                fullname: updatedUser.fullname,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                phone: updatedUser.phone
            };

            localStorage.setItem('user', JSON.stringify(user.value));
            return { success: true, message: response.data.message };
        } catch (error) {
            console.error('Update profile failed:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Cập nhật thất bại'
            };
        }
    };

    // Lấy thông tin user mới nhất từ server
    const fetchCurrentUser = async () => {
        try {
            const response = await getCurrentUserApi();
            const data = response.data.data;

            user.value = {
                id: data.id,
                username: data.username,
                email: data.email,
                fullname: data.fullname,
                avatar: data.avatar,
                role: data.role,
                phone: data.phone,
                createdAt: data.createdAt
            };

            localStorage.setItem('user', JSON.stringify(user.value));
        } catch (error) {
            console.error('Fetch current user failed:', error);
        }
    };

    // Đăng xuất và xóa toàn bộ dữ liệu phiên
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

    // Khôi phục phiên từ localStorage khi tải lại trang
    const checkAuth = () => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken) {
            token.value = savedToken;
        }

        if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
            try {
                user.value = JSON.parse(savedUser);
                console.log('User restored:', user.value);
            } catch (error) {
                // Dữ liệu localStorage bị hỏng, xóa và reset
                console.error('Failed to parse user data from localStorage:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                token.value = null;
                user.value = null;
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
        updateProfile,
        fetchCurrentUser,
    };
});
