import axios from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import { getAuthToken, removeAuthToken, removeUser } from '@/utils/helpers';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

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
