// Cấu hình Axios - HTTP client với interceptor tự động gắn token và xử lý lỗi 401
import axios from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import { getAuthToken, removeAuthToken, removeUser } from '@/utils/helpers';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor request: Tự động gắn Bearer token vào mỗi request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAuthToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor response: Chuyển hướng về login khi token hết hạn (401)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            removeAuthToken();
            removeUser();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
