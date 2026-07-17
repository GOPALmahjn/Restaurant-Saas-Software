import api from './axiosInstance';

export const getRestaurantBySlug = (slug) => api.get(`/restaurants/slug/${slug}`);
export const getRestaurantById = (id) => api.get(`/restaurants/${id}`);
export const createRestaurant = (data) => api.post('/restaurants', data);
export const updateRestaurant = (id, data) => api.put(`/restaurants/${id}`, data);
export const generateQRCode = (restaurantId, tableNumber) => api.get(`/restaurants/${restaurantId}/qr/${tableNumber}`);
export const getAllTableQRCodes = (restaurantId) => api.get(`/restaurants/${restaurantId}/qr-codes`);
