import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
        meta: { requiresGuest: true },
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/Register.vue'),
        meta: { requiresGuest: true },
    },
    {
        path: '/story/:id',
        name: 'StoryDetail',
        component: () => import('@/views/StoryDetail.vue'),
    },
    {
        path: '/story/:storyId/chapter/:chapterId',
        name: 'ReadChapter',
        component: () => import('@/views/ReadChapter.vue'),
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('@/views/Search.vue'),
    },
    {
        path: '/browse',
        name: 'Browse',
        component: () => import('@/views/Browse.vue'),
    },
    {
        path: '/category/:id',
        name: 'Category',
        component: () => import('@/views/Category.vue'),
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/favorites',
        name: 'Favorites',
        component: () => import('@/views/Favorites.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/history',
        name: 'History',
        component: () => import('@/views/History.vue'),
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    },
});


router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'Login', query: { redirect: to.fullPath } });
    }
    else if (to.meta.requiresGuest && authStore.isAuthenticated) {
        next({ name: 'Home' });
    }
    else {
        next();
    }
});

export default router;
