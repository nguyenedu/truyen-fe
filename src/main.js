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
import Tooltip from 'primevue/tooltip';
import 'primeicons/primeicons.css';
import { useAuthStore } from './stores/auth';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

// Initialize auth state BEFORE router
const authStore = useAuthStore();
authStore.checkAuth();

// Now initialize router
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

// Add directives
app.directive('tooltip', Tooltip);

app.mount('#app');
