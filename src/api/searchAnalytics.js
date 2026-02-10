import axios from '@/utils/axios';

/**
 * Lấy auto-suggest cho search
 */
export const getSearchSuggestions = (query, limit = 5) => {
    return axios.get('/api/search/suggest', {
        params: { q: query, limit }
    });
};

/**
 * Lấy trending searches
 */
export const getTrendingSearches = (limit = 10) => {
    return axios.get('/api/search/trending', {
        params: { limit }
    });
};

/**
 * Lấy popular searches
 */
export const getPopularSearches = (limit = 10, withScores = false) => {
    return axios.get('/api/search/popular', {
        params: { limit, withScores }
    });
};

/**
 * Lấy search history của user
 */
export const getUserSearchHistory = (limit = 20) => {
    return axios.get('/api/search/history', {
        params: { limit }
    });
};
