import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { RestaurantProvider } from './context/RestaurantContext';
import { UIProvider } from './context/UIContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import DishDetailPage from './pages/DishDetailPage';
import ARViewerPage from './pages/ARViewerPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import './App.css';

/** Scroll to top on route change, or to the section named by a hash link. */
const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname, hash]);

  return null;
};

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
};

const Page = ({ children }) => <motion.div {...pageTransition}>{children}</motion.div>;

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><HomePage /></Page>} />
        <Route path="/menu" element={<Page><MenuPage /></Page>} />
        <Route path="/menu/:id" element={<Page><DishDetailPage /></Page>} />
        <Route path="/ar/:id" element={<Page><ARViewerPage /></Page>} />
        <Route path="/cart" element={<Page><CartPage /></Page>} />
        <Route path="/checkout" element={<Page><CheckoutPage /></Page>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <RestaurantProvider>
      <UIProvider>
        <BrowserRouter>
          <ScrollManager />
          <Layout>
            <AnimatedRoutes />
          </Layout>
        </BrowserRouter>
      </UIProvider>
    </RestaurantProvider>
  );
}

export default App;
