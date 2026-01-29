import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './style.css';

// PrimeVue
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import 'primeicons/primeicons.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Use Aura preset (same as admin-fe)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: false
        }
    }
});

// Add services
app.use(ToastService);
app.use(ConfirmationService);

// Initialize auth state
import { useAuthStore } from './stores/auth';
const authStore = useAuthStore();
authStore.checkAuth();

app.mount('#app');
