import api from './axiosInstance';

export const getCategories = (restaurantId) => api.get(`/categories/restaurant/${restaurantId}`);
export const createCategory = (data) => api.post('/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
export const reorderCategories = (data) => api.put('/categories/reorder', data);
