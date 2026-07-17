import api from './axiosInstance';

export const getMenuItems = (restaurantId, params) => api.get(`/menu/restaurant/${restaurantId}`, { params });
export const getMenuItem = (id) => api.get(`/menu/${id}`);
export const getFeaturedItems = (restaurantId) => api.get(`/menu/restaurant/${restaurantId}/featured`);
export const getRecommendedItems = (restaurantId) => api.get(`/menu/restaurant/${restaurantId}/recommended`);
export const createMenuItem = (data) => api.post('/menu', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateMenuItem = (id, data) => api.put(`/menu/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteMenuItem = (id) => api.delete(`/menu/${id}`);
export const upload3DModel = (id, data) => api.post(`/menu/${id}/model`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const trackARView = (id) => api.post(`/menu/${id}/ar-view`);
