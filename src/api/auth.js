// API xác thực - Đăng nhập, đăng ký, quên mật khẩu, quản lý tài khoản
import axios from '@/utils/axios';

// Đăng nhập bằng tài khoản và mật khẩu
export const loginApi = (username, password) => {
    return axios.post('/api/auth/login', {
        username,
        password
    });
};

// Đăng ký tài khoản mới
export const registerApi = (userData) => {
    return axios.post('/api/auth/register', userData);
};

// Đăng xuất và hủy token
export const logoutApi = () => {
    return axios.post('/api/auth/logout');
};

// Cập nhật thông tin người dùng (gửi dạng multipart vì có avatar)
export const updateUserApi = (id, formData) => {
    return axios.put(`/api/users/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// Lấy thông tin người dùng hiện tại
export const getCurrentUserApi = () => {
    return axios.get('/api/users/me');
};

// Gửi email đặt lại mật khẩu
export const forgotPasswordApi = (email) => {
    return axios.post('/api/auth/forgot-password', { email });
};

// Đặt lại mật khẩu bằng token từ email
export const resetPasswordApi = (token, newPassword) => {
    return axios.post('/api/auth/reset-password', { token, newPassword });
};
