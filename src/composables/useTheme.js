// Composable giao diện - Quản lý chế độ sáng/tối toàn cục
import { ref, watch } from 'vue';

// State toàn cục (singleton) để chia sẻ giữa các component
const isDark = ref(false);
const initialized = ref(false);

export function useTheme() {
    // Bật/tắt chế độ tối
    const toggleTheme = () => {
        isDark.value = !isDark.value;
    };

    // Áp dụng theme vào DOM và lưu vào localStorage
    const applyTheme = () => {
        const html = document.documentElement;
        const body = document.body;

        if (isDark.value) {
            html.classList.add('dark');
            body.classList.add('dark');
            html.style.colorScheme = 'dark';
            localStorage.setItem('theme', 'dark');
        } else {
            html.classList.remove('dark');
            body.classList.remove('dark');
            html.style.colorScheme = 'light';
            localStorage.setItem('theme', 'light');
        }
    };

    // Khởi tạo theme từ localStorage hoặc preference hệ thống
    const initTheme = () => {
        if (!initialized.value) {
            const saved = localStorage.getItem('theme');
            if (saved === 'dark') {
                isDark.value = true;
            } else if (saved === 'light') {
                isDark.value = false;
            } else {
                // Mặc định theo preference hệ thống
                isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
            applyTheme();
            initialized.value = true;
        }
    };

    initTheme();

    // Tự động cập nhật DOM khi state thay đổi
    watch(isDark, () => {
        applyTheme();
    });

    return {
        isDark,
        toggleTheme,
        initTheme
    };
}
