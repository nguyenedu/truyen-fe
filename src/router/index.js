import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Auth Views
import LoginAuth from '@/views/auth/LoginAuth.vue';
import RegisterAuth from '@/views/auth/RegisterAuth.vue';
import ViewForgotPassword from '@/views/auth/ViewForgotPassword.vue';
import ViewResetPassword from '@/views/auth/ViewResetPassword.vue';

// Home Views
import ViewHome from '@/views/home/ViewHome.vue';

// Story Views
import ViewStory from '@/views/story/ViewStory.vue';
import ReadChapter from '@/views/story/ReadChapter.vue';
import ViewAuthor from '@/views/story/ViewAuthor.vue';

// Search Views
import BrowseStory from '@/views/search/BrowseStory.vue';
import SearchStory from '@/views/search/SearchStory.vue';
import ViewCategory from '@/views/search/ViewCategory.vue';

// User Views
import ViewProfile from '@/views/user/ViewProfile.vue';
import ViewFavorites from '@/views/user/ViewFavorites.vue';
import ViewHistory from '@/views/user/ViewHistory.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: ViewHome,
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginAuth,
        meta: { requiresGuest: true },
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterAuth,
        meta: { requiresGuest: true },
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ViewForgotPassword,
        meta: { requiresGuest: true },
    },
    {
        path: '/reset-password',
        name: 'ResetPassword',
        component: ViewResetPassword,
        meta: { requiresGuest: true },
    },
    {
        path: '/story/:id',
        name: 'StoryDetail',
        component: ViewStory,
    },
    {
        path: '/story/:storyId/chapter/:chapterId',
        name: 'ReadChapter',
        component: ReadChapter,
    },
    {
        path: '/search',
        name: 'Search',
        component: SearchStory,
    },
    {
        path: '/browse',
        name: 'Browse',
        component: BrowseStory,
    },
    {
        path: '/category/:id',
        name: 'Category',
        component: ViewCategory,
    },
    {
        path: '/profile',
        name: 'Profile',
        component: ViewProfile,
        meta: { requiresAuth: true },
    },
    {
        path: '/favorites',
        name: 'Favorites',
        component: ViewFavorites,
        meta: { requiresAuth: true },
    },
    {
        path: '/history',
        name: 'History',
        component: ViewHistory,
        meta: { requiresAuth: true },
    },
    {
        path: '/author/:id',
        name: 'Author',
        component: ViewAuthor,
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
