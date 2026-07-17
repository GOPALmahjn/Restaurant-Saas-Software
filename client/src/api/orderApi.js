import api from './axiosInstance';

export const createOrder = (data) => api.post('/orders', data);
export const getOrders = (restaurantId, params) => api.get(`/orders/restaurant/${restaurantId}`, { params });
export const getOrder = (id) => api.get(`/orders/${id}`);
export const getOrderByNumber = (orderNumber) => api.get(`/orders/track/${orderNumber}`);
export const updateOrderStatus = (id, data) => api.put(`/orders/${id}/status`, data);
export const validateCoupon = (data) => api.post('/orders/validate-coupon', data);
