import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Sakai from './presets/sakai';
import router from './router';
import App from './App.vue';

import 'primeicons/primeicons.css';
import './style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Sakai,
        options: {
            darkModeSelector: '.dark-mode',
            cssLayer: {
                name: 'primevue',
                order: 'tailwind-base, primevue, tailwind-utilities'
            }
        }
    }
});

// Initialize auth state from localStorage
import { useAuthStore } from './stores/auth';
const authStore = useAuthStore();
authStore.checkAuth();

app.mount('#app');
