import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, X, ShoppingBag, ArrowRight, TicketPercent } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useUI } from '../../context/UIContext';
import LazyImage from '../ui/LazyImage';

const CartDrawer = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    gst,
    delivery,
    total,
    couponCode,
    setCouponCode,
    selectedTable,
  } = useRestaurant();
  const { isCartOpen, closeCart } = useUI();

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 34 }}
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col border-l border-white/10 bg-[#070B16]/95 backdrop-blur-2xl"
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF6B35]/12 text-[#FF6B35]">
                  <ShoppingBag size={18} />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-white">Your order</h2>
                  <p className="text-xs text-[#A0AEC0]">
                    Table {selectedTable} • {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#A0AEC0] transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </header>

            {/* Items */}
            <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-4">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex h-full flex-col items-center justify-center gap-4 text-center"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-3xl">
                    🍽️
                  </div>
                  <div>
                    <p className="font-semibold text-white">Your cart is empty</p>
                    <p className="mt-1 text-sm text-[#A0AEC0]">
                      Add a few signature dishes and return here.
                    </p>
                  </div>
                  <Link
                    to="/menu"
                    onClick={closeCart}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F97316] px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    Browse menu <ArrowRight size={15} />
                  </Link>
                </motion.div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {cart.map((entry) => (
                      <motion.li
                        key={entry.id}
                        layout
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                      >
                        <LazyImage
                          src={entry.image}
                          alt={entry.name}
                          wrapperClassName="h-16 w-16 shrink-0 rounded-xl"
                          className="h-16 w-16 rounded-xl object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">{entry.name}</p>
                          <p className="text-xs text-[#A0AEC0]">${entry.price.toFixed(2)} each</p>

                          <div className="mt-2 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#070B16]/60 p-0.5">
                              <button
                                type="button"
                                onClick={() => updateQuantity(entry.id, entry.quantity - 1)}
                                aria-label={`Decrease ${entry.name} quantity`}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#A0AEC0] transition-colors hover:bg-white/10 hover:text-white"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="min-w-6 text-center text-sm font-semibold text-white">
                                {entry.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(entry.id, entry.quantity + 1)}
                                aria-label={`Increase ${entry.name} quantity`}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#A0AEC0] transition-colors hover:bg-white/10 hover:text-white"
                              >
                                <Plus size={13} />
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-[#FF6B35]">
                                ${(entry.price * entry.quantity).toFixed(2)}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFromCart(entry.id)}
                                aria-label={`Remove ${entry.name}`}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#A0AEC0] transition-colors hover:bg-red-500/12 hover:text-red-400"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Summary */}
            {cart.length > 0 && (
              <motion.footer
                layout
                className="border-t border-white/10 bg-white/[0.03] px-5 py-4"
              >
                <label className="mb-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-[#070B16]/60 px-3 py-2.5">
                  <TicketPercent size={15} className="shrink-0 text-[#FFB347]" aria-hidden="true" />
                  <input
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                    placeholder="Coupon code — try AR25"
                    aria-label="Coupon code"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#A0AEC0]/70"
                  />
                  {discount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400"
                    >
                      -15%
                    </motion.span>
                  )}
                </label>

                <dl className="space-y-1.5 text-sm">
                  <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                  {discount > 0 && (
                    <Row label="Discount" value={`-$${discount.toFixed(2)}`} accent="text-emerald-400" />
                  )}
                  <Row label="GST (18%)" value={`$${gst.toFixed(2)}`} />
                  <Row label="Delivery" value={`$${delivery.toFixed(2)}`} />
                </dl>

                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="text-sm text-[#A0AEC0]">Total</span>
                  <motion.span
                    key={total}
                    initial={{ scale: 1.12, color: '#FF6B35' }}
                    animate={{ scale: 1, color: '#FFFFFF' }}
                    transition={{ duration: 0.3 }}
                    className="text-xl font-bold text-white"
                  >
                    ${total.toFixed(2)}
                  </motion.span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    to="/cart"
                    onClick={closeCart}
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    View cart
                  </Link>
                  <motion.div whileTap={{ scale: 0.97 }} className="flex-1">
                    <Link
                      to="/checkout"
                      onClick={closeCart}
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F97316] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-6px_rgba(255,107,53,0.7)]"
                    >
                      Checkout
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </motion.div>
                </div>
              </motion.footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

const Row = ({ label, value, accent = 'text-white' }) => (
  <div className="flex items-center justify-between">
    <dt className="text-[#A0AEC0]">{label}</dt>
    <dd className={accent}>{value}</dd>
  </div>
);

export default CartDrawer;
