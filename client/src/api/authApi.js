import api from './axiosInstance';

export const loginUser = (data) => api.post('/auth/login', data);
export const adminLogin = (data) => api.post('/auth/admin/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const logoutUser = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');
export const refreshTokenApi = () => api.post('/auth/refresh');
export const updateProfile = (data) => api.put('/auth/profile', data);
