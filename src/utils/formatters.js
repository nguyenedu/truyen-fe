// Hàm format dữ liệu - Định dạng ngày tháng và số cho hiển thị

// Định dạng ngày theo locale (mặc định: Việt Nam)
export const formatDate = (dateString, options = { locale: 'vi-VN' }) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(options.locale);
};

// Chuyển ngày thành dạng tương đối (VD: "5 phút trước", "2 ngày trước")
export const formatRelativeDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return formatDate(dateString);
};

// Định dạng số với dấu chấm phân cách hàng nghìn (VD: 1.000.000)
export const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Rút gọn số lớn (VD: 1500 → "1.5K", 2000000 → "2.0M")
export const formatCompactNumber = (num) => {
    if (!num && num !== 0) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};
