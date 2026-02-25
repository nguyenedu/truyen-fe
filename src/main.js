// Điểm khởi tạo ứng dụng - Cấu hình Vue, Pinia, Router, PrimeVue
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './style.css';

// PrimeVue UI Framework
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import Tooltip from 'primevue/tooltip';
import 'primeicons/primeicons.css';
import { useAuthStore } from './stores/auth';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

// Khôi phục phiên đăng nhập TRƯỚC khi khởi tạo router (tránh redirect sai)
const authStore = useAuthStore();
authStore.checkAuth();

// Khởi tạo router sau khi đã có trạng thái xác thực
app.use(router);

// Cấu hình PrimeVue với theme Aura
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: false
        }
    }
});

// Đăng ký dịch vụ PrimeVue
app.use(ToastService);
app.use(ConfirmationService);

// Đăng ký directive
app.directive('tooltip', Tooltip);

app.mount('#app');
