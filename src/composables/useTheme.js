import { ref, watch } from 'vue';

const isDark = ref(false);
const initialized = ref(false);

export function useTheme() {
    const toggleTheme = () => {
        isDark.value = !isDark.value;
        updateTheme();
    };

    const updateTheme = () => {
        if (isDark.value) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const initTheme = () => {
        if (!initialized.value) {
            isDark.value = false;
            localStorage.setItem('theme', 'light');
            updateTheme();
            initialized.value = true;
        }
    };


    initTheme();


    watch(isDark, () => {
        updateTheme();
    });

    return {
        isDark,
        toggleTheme,
        initTheme
    };
}
