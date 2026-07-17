export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const DEMO_RESTAURANT_ID = import.meta.env.VITE_DEMO_RESTAURANT_ID || '6507f1f77bcf86cd799439010';

export const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🍽️', color: '#f97316' },
  { id: 'veg', name: 'Veg', icon: '🥗', color: '#16a34a' },
  { id: 'non-veg', name: 'Non-Veg', icon: '🍖', color: '#dc2626' },
  { id: 'pizza', name: 'Pizza', icon: '🍕', color: '#f59e0b' },
  { id: 'burger', name: 'Burger', icon: '🍔', color: '#ef4444' },
  { id: 'pasta', name: 'Pasta', icon: '🍝', color: '#f97316' },
  { id: 'dessert', name: 'Dessert', icon: '🍰', color: '#ec4899' },
  { id: 'drinks', name: 'Drinks', icon: '🥤', color: '#06b6d4' },
];

export const SPICE_LEVELS = [
  { value: 'mild', label: 'Mild 🌶️', color: '#fbbf24' },
  { value: 'medium', label: 'Medium 🌶️🌶️', color: '#f97316' },
  { value: 'hot', label: 'Hot 🌶️🌶️🌶️', color: '#ef4444' },
  { value: 'extra-hot', label: 'Extra Hot 🔥', color: '#dc2626' },
];

export const ORDER_STATUS = {
  pending: { label: 'Pending', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  confirmed: { label: 'Confirmed', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  preparing: { label: 'Preparing', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  ready: { label: 'Ready', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  served: { label: 'Served', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' },
  completed: { label: 'Completed', color: '#16a34a', bg: 'rgba(22, 163, 74, 0.1)' },
  cancelled: { label: 'Cancelled', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash on Delivery', icon: '💵' },
  { value: 'upi', label: 'UPI Payment', icon: '📱' },
  { value: 'card', label: 'Credit / Debit Card', icon: '💳' },
];

export const AR_INSTRUCTIONS = [
  { icon: '📱', text: 'Hold your phone steady and move slowly' },
  { icon: '🔦', text: 'Make sure the area is well-lit' },
  { icon: '📐', text: 'Point camera at a flat surface like a table' },
  { icon: '👆', text: 'Tap on the surface to place the 3D dish' },
  { icon: '🤏', text: 'Pinch to resize, drag to move' },
];

export const ALLERGENS = [
  'Gluten', 'Dairy', 'Eggs', 'Nuts', 'Peanuts', 'Soy', 'Shellfish', 'Fish', 'Sesame',
];
