// Composable giao diện - Quản lý chế độ sáng/tối cho trang đọc truyện
import { ref, watch } from 'vue';

// State toàn cục (singleton) để chia sẻ giữa các component
const isDark = ref(false);
const initialized = ref(false);

export function useTheme() {
    // Bật/tắt chế độ tối
    const toggleTheme = () => {
        isDark.value = !isDark.value;
        updateTheme();
    };

    // Áp dụng theme vào DOM và lưu vào localStorage
    const updateTheme = () => {
        if (isDark.value) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    // Khởi tạo theme mặc định (sáng), chỉ chạy một lần
    const initTheme = () => {
        if (!initialized.value) {
            isDark.value = false;
            localStorage.setItem('theme', 'light');
            updateTheme();
            initialized.value = true;
        }
    };

    initTheme();

    // Tự động cập nhật DOM khi state thay đổi
    watch(isDark, () => {
        updateTheme();
    });

    return {
        isDark,
        toggleTheme,
        initTheme
    };
}
