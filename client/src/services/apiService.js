import { adminStats, menuItems, restaurant, reviews } from '../data/mockData.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    return await response.json();
  } catch (error) {
    console.warn(`Falling back to local data for ${endpoint}:`, error.message);
    return null;
  }
};

export const fetchRestaurantOverview = async () => {
  await delay(250);
  const payload = await request('/restaurants/slug/velvet-bloom');
  return payload?.data || restaurant;
};

export const fetchMenuItems = async () => {
  await delay(250);
  const payload = await request('/menu/restaurant/placeholder');
  return payload?.data || menuItems;
};

export const fetchDishById = async (id) => {
  await delay(250);
  const payload = await request(`/menu/${id}`);
  if (payload?.data) return payload.data;
  return menuItems.find((item) => item.id === id) || menuItems[0];
};

export const fetchReviews = async () => {
  await delay(200);
  return reviews;
};

export const fetchAdminStats = async () => {
  await delay(200);
  return adminStats;
};

export const submitOrder = async (order) => {
  await delay(400);
  return {
    success: true,
    message: 'Order placed successfully',
    orderNumber: `AR-${Math.floor(1000 + Math.random() * 9000)}`,
    order,
  };
};
