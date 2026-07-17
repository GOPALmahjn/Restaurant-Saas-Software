import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'velvet-bloom:favorites';

const read = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Favorites persisted to localStorage. Each hook instance subscribes to a
 * window event so every card re-renders when any of them toggles.
 */
const EVENT = 'favorites:changed';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(read);

  useEffect(() => {
    const sync = () => setFavorites(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggleFavorite = useCallback((id) => {
    const current = read();
    const next = current.includes(id)
      ? current.filter((entry) => entry !== id)
      : [...current, id];

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable (private mode) — keep the in-memory value.
    }

    window.dispatchEvent(new Event(EVENT));
    setFavorites(next);
  }, []);

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
};

export default useFavorites;
