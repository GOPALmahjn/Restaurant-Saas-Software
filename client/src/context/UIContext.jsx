import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const UIContext = createContext(null);

/**
 * Presentation-only state (cart drawer, search palette, mobile nav).
 * Kept separate from RestaurantContext so cart/order state stays the
 * single source of truth for business logic.
 */
export const UIProvider = ({ children }) => {
  const [isCartOpen, setCartOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // Close every overlay on Escape.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setCartOpen(false);
      setSearchOpen(false);
      setMobileNavOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Lock body scroll while an overlay owns the screen.
  useEffect(() => {
    const locked = isCartOpen || isSearchOpen || isMobileNavOpen;
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen, isSearchOpen, isMobileNavOpen]);

  const value = useMemo(
    () => ({
      isCartOpen,
      openCart,
      closeCart,
      isSearchOpen,
      openSearch,
      closeSearch,
      isMobileNavOpen,
      setMobileNavOpen,
    }),
    [isCartOpen, isSearchOpen, isMobileNavOpen, openCart, closeCart, openSearch, closeSearch],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
};
