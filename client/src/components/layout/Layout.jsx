import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import SearchModal from '../search/SearchModal';

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-surface-50 text-surface-900 transition-colors duration-300 dark:bg-[#070B16] dark:text-white">
      {/* Ambient page glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-[#FF6B35]/8 blur-[120px]" />
        <div className="absolute -right-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-[#FFB347]/6 blur-[120px]" />
      </div>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[99] focus:rounded-full focus:bg-[#FF6B35] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <div className="relative z-10">
        <Navbar />
        <main
          id="main-content"
          className="mx-auto flex w-full max-w-7xl flex-col px-4 pb-10 sm:px-6 lg:px-8"
        >
          {children}
        </main>
        <Footer />
      </div>

      <CartDrawer />
      <SearchModal />
    </div>
  );
};

export default Layout;
