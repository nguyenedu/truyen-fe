export const getErrorMessage = (error, defaultMessage = 'Có lỗi xảy ra, vui lòng thử lại sau') => {
    if (error.response && error.response.data && error.response.data.message) {
        return error.response.data.message;
    }
    return error.message || defaultMessage;
};

export const showToast = (toast, severity, summary, detail, life = 3000) => {
    toast.add({ severity, summary, detail, life });
};

export const showSuccessToast = (toast, summary, detail) => showToast(toast, 'success', summary, detail);
export const showWarningToast = (toast, summary, detail) => showToast(toast, 'warn', summary, detail);
export const showErrorToast = (toast, error, defaultMessage) => {
    showToast(toast, 'error', 'Lỗi', getErrorMessage(error, defaultMessage));
};

export const handleAuthRequired = (authStore, router, toast, message = 'Vui lòng đăng nhập để thực hiện chức năng này') => {
    if (!authStore.isAuthenticated) {
        showWarningToast(toast, 'Chưa đăng nhập', message);
        router.push('/login');
        return true;
    }
    return false;
};

export const extractData = (response) => {
    const data = response?.data?.data;
    if (data && typeof data === 'object' && 'content' in data) {
        return {
            content: data.content || [],
            total: data.totalElements || 0
        };
    }
    return {
        content: data || [],
        total: (data || []).length
    };
};

export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token) => localStorage.setItem('token', token);
export const removeAuthToken = () => localStorage.removeItem('token');

export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};
export const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
export const removeUser = () => localStorage.removeItem('user');
