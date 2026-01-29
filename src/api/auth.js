import axios from './axios';

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
