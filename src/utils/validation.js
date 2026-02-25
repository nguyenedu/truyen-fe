// Hàm validate - Kiểm tra dữ liệu đầu vào cho form

// Kiểm tra giá trị bắt buộc (không rỗng, không null, không undefined)
export const isRequired = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
};

// Kiểm tra định dạng email hợp lệ
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Kiểm tra mật khẩu (tối thiểu 6 ký tự)
export const isValidPassword = (password) => {
    return password && password.length >= 6;
};
