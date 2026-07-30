import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Menu,
  ShoppingBag,
  Sun,
  Moon,
  Search,
  User,
  X,
  Home,
  LayoutGrid,
  Scan,
  Flame,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useUI } from '../../context/UIContext';
import { restaurant } from '../../data/mockData';

/* `hash` targets home-page sections; `to` targets a route. */
const NAV_LINKS = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Categories', to: '/#categories', icon: LayoutGrid },
  { label: 'AR Menu', to: '/ar/1', icon: Scan },
  { label: "Today's Specials", to: '/#specials', icon: Flame },
];

const Navbar = () => {
  const { cart, theme, setTheme } = useRestaurant();
  const { openCart, openSearch, isMobileNavOpen, setMobileNavOpen } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();

  useMotionValueEvent(scrollY, 'change', (latest) => setScrolled(latest > 12));

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname, location.hash, setMobileNavOpen]);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isLinkActive = (link) => {
    const [rawPath, sectionHash] = link.to.split('#');
    const targetPath = rawPath || '/';

    // Section links (e.g. "/#categories") are active only when we're on their
    // page AND their section is the one in the URL hash.
    if (sectionHash) {
      return location.pathname === targetPath && location.hash === `#${sectionHash}`;
    }

    // Home should yield to a section link when a hash is present, so the pill
    // moves to Categories / Today's Specials instead of staying on Home.
    if (link.to === '/') {
      return location.pathname === '/' && !location.hash;
    }

    return location.pathname === link.to;
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4"
      >
        <motion.nav
          animate={{
            boxShadow: scrolled
              ? '0 20px 60px -20px rgba(0,0,0,0.9)'
              : '0 8px 32px -16px rgba(0,0,0,0.5)',
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={`mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-3xl border px-3 py-2.5 backdrop-blur-2xl transition-colors sm:px-4 sm:py-3 ${
            scrolled
              ? 'border-black/10 bg-white/85 dark:border-white/12 dark:bg-[#070B16]/85'
              : 'border-black/5 bg-white/70 dark:border-white/8 dark:bg-white/5'
          }`}
        >
          {/* Brand */}
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-3"
            aria-label={`${restaurant.name} — home`}
          >
            <motion.div
              whileHover={{ rotate: -6, scale: 1.06 }}
              transition={{ type: 'spring', stiffness: 400, damping: 12 }}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FFB347] text-sm font-bold text-white shadow-[0_8px_24px_-6px_rgba(255,107,53,0.8)]"
            >
              {restaurant.logo}
            </motion.div>
            <div className="hidden sm:block">
              <p className="text-[15px] font-semibold leading-tight tracking-tight text-surface-900 dark:text-white">
                {restaurant.name}
              </p>
              <p className="text-[11px] leading-tight text-[#A0AEC0]">AR Dining</p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isLinkActive(link)
                    ? 'text-surface-900 dark:text-white'
                    : 'text-surface-500 hover:text-surface-900 dark:text-[#A0AEC0] dark:hover:text-white'
                }`}
              >
                {isLinkActive(link) && (
                  <motion.span
                    layoutId="nav-active-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-full border border-[#FF6B35]/30 bg-[#FF6B35]/12"
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1.5">
            <IconButton label="Search dishes" onClick={openSearch}>
              <Search size={17} />
            </IconButton>

            <IconButton
              label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                </motion.span>
              </AnimatePresence>
            </IconButton>

            <IconButton label="User profile" className="hidden sm:inline-flex">
              <User size={17} />
            </IconButton>

            {/* Cart */}
            <motion.button
              type="button"
              onClick={openCart}
              whileTap={{ scale: 0.92 }}
              aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#FF6B35]/30 bg-[#FF6B35]/12 text-[#FF6B35] transition-colors hover:bg-[#FF6B35]/20"
            >
              <ShoppingBag size={17} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                    className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B35] to-[#F97316] px-1 text-[10px] font-bold text-white shadow-lg"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <IconButton
              label={isMobileNavOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden"
              aria-expanded={isMobileNavOpen}
            >
              {isMobileNavOpen ? <X size={17} /> : <Menu size={17} />}
            </IconButton>
          </div>
        </motion.nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileNavOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -12, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-[#070B16]/95 p-2 backdrop-blur-2xl lg:hidden"
            >
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NavLink
                    to={link.to}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[#A0AEC0] transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <link.icon size={17} className="text-[#FF6B35]" />
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <div className="mt-1 border-t border-white/10 pt-1">
                <NavLink
                  to="/cart"
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[#A0AEC0] transition-colors hover:bg-white/5 hover:text-white"
                >
                  <ShoppingBag size={17} className="text-[#FF6B35]" />
                  Full cart page
                </NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer for the fixed navbar */}
      <div className="h-[76px] sm:h-[84px]" aria-hidden="true" />
    </>
  );
};

const IconButton = ({ children, label, className = '', ...props }) => (
  <motion.button
    type="button"
    whileTap={{ scale: 0.92 }}
    aria-label={label}
    title={label}
    className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black/5 text-surface-500 transition-colors hover:bg-black/10 hover:text-surface-900 dark:border-white/10 dark:bg-white/5 dark:text-[#A0AEC0] dark:hover:bg-white/10 dark:hover:text-white ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

export default Navbar;
