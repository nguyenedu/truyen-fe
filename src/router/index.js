// Cấu hình Router - Định tuyến trang, bảo vệ route, và scroll behavior
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// === Trang xác thực ===
import LoginAuth from '@/views/auth/LoginAuth.vue';
import RegisterAuth from '@/views/auth/RegisterAuth.vue';
import ViewForgotPassword from '@/views/auth/ViewForgotPassword.vue';
import ViewResetPassword from '@/views/auth/ViewResetPassword.vue';

// === Trang chính ===
import ViewHome from '@/views/home/ViewHome.vue';

// === Trang truyện ===
import ViewStory from '@/views/story/ViewStory.vue';
import ReadChapter from '@/views/story/ReadChapter.vue';
import ViewAuthor from '@/views/story/ViewAuthor.vue';

// === Trang tìm kiếm ===
import BrowseStory from '@/views/search/BrowseStory.vue';
import SearchStory from '@/views/search/SearchStory.vue';
import ViewCategory from '@/views/search/ViewCategory.vue';

// === Trang người dùng ===
import ViewProfile from '@/views/user/ViewProfile.vue';
import ViewFavorites from '@/views/user/ViewFavorites.vue';
import ViewHistory from '@/views/user/ViewHistory.vue';
import ViewWallet from '@/views/user/ViewWallet.vue';

// === Trang thanh toán ===
import ViewTopUp from '@/views/payment/ViewTopUp.vue';
import ViewPaymentResult from '@/views/payment/ViewPaymentResult.vue';

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
    {
        path: '/wallet',
        name: 'Wallet',
        component: ViewWallet,
        meta: { requiresAuth: true },
    },
    {
        path: '/top-up',
        name: 'TopUp',
        component: ViewTopUp,
        meta: { requiresAuth: true },
    },
    {
        path: '/payment/result',
        name: 'PaymentResult',
        component: ViewPaymentResult,
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    // Khôi phục vị trí scroll khi quay lại, hoặc cuộn lên đầu khi chuyển trang mới
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    },
});


// Navigation Guard: Kiểm tra quyền truy cập trước mỗi lần chuyển trang
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        // Chưa đăng nhập → chuyển về login, lưu lại đường dẫn để redirect sau
        next({ name: 'Login', query: { redirect: to.fullPath } });
    }
    else if (to.meta.requiresGuest && authStore.isAuthenticated) {
        // Đã đăng nhập → không cho vào trang login/register
        next({ name: 'Home' });
    }
    else {
        next();
    }
});

export default router;
