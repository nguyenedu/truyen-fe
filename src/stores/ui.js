import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
    const loading = ref(false);

    const setLoading = (value) => {
        loading.value = value;
    };

    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

    return {
        loading,
        setLoading,
        startLoading,
        stopLoading
    };
});
