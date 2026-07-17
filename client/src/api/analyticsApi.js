import api from './axiosInstance';

export const getDashboardStats = (restaurantId) => api.get(`/analytics/restaurant/${restaurantId}/dashboard`);
export const getRevenueChart = (restaurantId, period) => api.get(`/analytics/restaurant/${restaurantId}/revenue`, { params: { period } });
export const getTopItems = (restaurantId) => api.get(`/analytics/restaurant/${restaurantId}/top-items`);
