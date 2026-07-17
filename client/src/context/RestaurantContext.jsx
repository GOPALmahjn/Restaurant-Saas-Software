import { createContext, useContext, useMemo, useState } from 'react';

const RestaurantContext = createContext(null);

export const RestaurantProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [selectedTable, setSelectedTable] = useState('12');
  const [couponCode, setCouponCode] = useState('');
  const [theme, setTheme] = useState('dark');

  const addToCart = (item) => {
    setCart((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      if (existing) {
        return current.map((entry) => entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry);
      }
      return [...current, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, quantity) => {
    setCart((current) => current.flatMap((entry) => entry.id === id ? (quantity > 0 ? [{ ...entry, quantity }] : []) : [entry]));
  };

  const removeFromCart = (id) => {
    setCart((current) => current.filter((entry) => entry.id !== id));
  };

  const clearCart = () => setCart([]);

  const subtotal = useMemo(() => cart.reduce((sum, entry) => sum + entry.price * entry.quantity, 0), [cart]);
  const discount = couponCode === 'AR25' ? subtotal * 0.15 : 0;
  const gst = (subtotal - discount) * 0.18;
  const delivery = subtotal > 0 ? 45 : 0;
  const total = subtotal - discount + gst + delivery;

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    selectedTable,
    setSelectedTable,
    couponCode,
    setCouponCode,
    theme,
    setTheme,
    subtotal,
    discount,
    gst,
    delivery,
    total,
  };

  return <RestaurantContext.Provider value={value}>{children}</RestaurantContext.Provider>;
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within RestaurantProvider');
  }
  return context;
};
