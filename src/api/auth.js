import axios from '@/utils/axios';

export const loginApi = (username, password) => {
    return axios.post('/api/auth/login', {
        username,
        password
    });
};

export const registerApi = (userData) => {
    return axios.post('/api/auth/register', userData);
};

export const logoutApi = () => {
    return axios.post('/api/auth/logout');
};

export const updateUserApi = (id, formData) => {
    return axios.put(`/api/users/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getCurrentUserApi = () => {
    return axios.get('/api/users/me');
};

export const forgotPasswordApi = (email) => {
    return axios.post('/api/auth/forgot-password', { email });
};

export const resetPasswordApi = (token, newPassword) => {
    return axios.post('/api/auth/reset-password', { token, newPassword });
};
