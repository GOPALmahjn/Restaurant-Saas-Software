import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  TicketPercent,
  Receipt,
  Utensils,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import LazyImage from '../components/ui/LazyImage';
import Badge from '../components/ui/Badge';

const CartPage = () => {
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
  } = useRestaurant();

  const itemCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);

  return (
    <div className="grid gap-8 pt-2 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      {/* Items */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[28px] border border-black/[0.07] bg-black/[0.02] p-6 backdrop-blur-xl sm:p-8 dark:border-white/10 dark:bg-white/5"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF6B35]/12 text-[#FF6B35]">
              <ShoppingBag size={19} />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
                Your order
              </h1>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-surface-600 dark:text-[#A0AEC0]">
                <Utensils size={13} aria-hidden="true" />
                Table {localStorage.getItem('table') || '12'} • Fast pickup • {itemCount}{' '}
                {itemCount === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
        </motion.div>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 rounded-[28px] border border-dashed border-black/[0.07] bg-black/[0.02] p-14 text-center dark:border-white/10 dark:bg-white/5"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-3xl border border-black/[0.07] bg-black/[0.02] text-3xl dark:border-white/10 dark:bg-white/5">
              🍽️
            </span>
            <div>
              <p className="font-semibold text-surface-900 dark:text-white">Your cart is empty</p>
              <p className="mt-1 text-sm text-surface-600 dark:text-[#A0AEC0]">
                Add a few signature dishes and return here.
              </p>
            </div>
            <Link
              to="/menu"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F97316] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-6px_rgba(255,107,53,0.7)]"
            >
              Browse menu
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        ) : (
          <ul className="space-y-4">
            <AnimatePresence initial={false}>
              {cart.map((entry) => (
                <motion.li
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -32, height: 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                  className="flex flex-col gap-4 rounded-3xl border border-black/[0.07] bg-black/[0.02] p-4 backdrop-blur-xl transition-colors hover:border-black/[0.12] sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
                >
                  <div className="flex items-center gap-4">
                    <Link to={`/menu/${entry.id}`} className="shrink-0">
                      <LazyImage
                        src={entry.image}
                        alt={entry.name}
                        wrapperClassName="h-20 w-20 rounded-2xl"
                        className="h-20 w-20 rounded-2xl object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </Link>

                    <div className="min-w-0">
                      <Link to={`/menu/${entry.id}`}>
                        <h2 className="truncate font-semibold text-surface-900 transition-colors hover:text-[#FF6B35] dark:text-white">
                          {entry.name}
                        </h2>
                      </Link>
                      <p className="mt-0.5 text-sm text-surface-600 dark:text-[#A0AEC0]">${entry.price.toFixed(2)} each</p>
                      {entry.type && (
                        <div className="mt-2">
                          <Badge variant={entry.type === 'veg' ? 'veg' : 'non-veg'}>
                            {entry.type === 'veg' ? 'Veg' : 'Non-Veg'}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="flex items-center gap-1 rounded-full border border-black/[0.07] bg-black/[0.03] p-1 dark:border-white/10 dark:bg-[#070B16]/60">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.85 }}
                        onClick={() => updateQuantity(entry.id, entry.quantity - 1)}
                        aria-label={`Decrease ${entry.name} quantity`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-surface-600 transition-colors hover:bg-black/[0.08] hover:text-surface-900 dark:text-[#A0AEC0] dark:hover:bg-white/10 dark:hover:text-white"
                      >
                        <Minus size={14} />
                      </motion.button>

                      <motion.span
                        key={entry.quantity}
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.25 }}
                        className="min-w-8 text-center text-sm font-bold text-surface-900 dark:text-white"
                      >
                        {entry.quantity}
                      </motion.span>

                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.85 }}
                        onClick={() => updateQuantity(entry.id, entry.quantity + 1)}
                        aria-label={`Increase ${entry.name} quantity`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-surface-600 transition-colors hover:bg-black/[0.08] hover:text-surface-900 dark:text-[#A0AEC0] dark:hover:bg-white/10 dark:hover:text-white"
                      >
                        <Plus size={14} />
                      </motion.button>
                    </div>

                    <span className="min-w-16 text-right text-lg font-bold text-[#FF6B35]">
                      ${(entry.price * entry.quantity).toFixed(2)}
                    </span>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromCart(entry.id)}
                      aria-label={`Remove ${entry.name} from cart`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-surface-600 transition-colors hover:bg-red-500/12 hover:text-red-400 dark:text-[#A0AEC0]"
                    >
                      <Trash2 size={15} />
                    </motion.button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {/* Summary */}
      <motion.aside
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-[28px] border border-black/[0.07] bg-black/[0.02] p-6 backdrop-blur-xl sm:p-8 lg:sticky lg:top-28 dark:border-white/10 dark:bg-gradient-to-b dark:from-white/8 dark:to-white/4"
      >
        <div className="flex items-center gap-2.5">
          <Receipt size={17} className="text-[#FF6B35]" aria-hidden="true" />
          <h2 className="text-xl font-bold text-surface-900 dark:text-white">Summary</h2>
        </div>

        <dl className="mt-6 space-y-3 text-sm">
          <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
          <Row
            label="Discount"
            value={`-$${discount.toFixed(2)}`}
            accent={discount > 0 ? 'text-emerald-400' : 'text-surface-600 dark:text-[#A0AEC0]'}
          />
          <Row label="GST (18%)" value={`$${gst.toFixed(2)}`} />
          <Row label="Delivery" value={`$${delivery.toFixed(2)}`} />
        </dl>

        {/* Coupon */}
        <div className="mt-6 rounded-2xl border border-black/[0.07] bg-black/[0.03] p-4 dark:border-white/10 dark:bg-[#070B16]/50">
          <label
            htmlFor="coupon"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-[#A0AEC0]"
          >
            <TicketPercent size={13} className="text-[#FFB347]" aria-hidden="true" />
            Coupon
          </label>
          <div className="mt-2.5 flex items-center gap-2">
            <input
              id="coupon"
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
              placeholder="Try AR25"
              className="w-full rounded-full border border-black/[0.07] bg-black/[0.03] px-4 py-2.5 text-sm text-surface-900 outline-none transition-colors placeholder:text-[#A0AEC0]/60 focus:border-[#FF6B35]/50 dark:border-white/10 dark:bg-[#070B16]/60 dark:text-white"
            />
            <AnimatePresence>
              {discount > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="shrink-0 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-400"
                >
                  −15%
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Total */}
        <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-5 dark:border-white/10">
          <span className="text-base font-semibold text-surface-900 dark:text-white">Total</span>
          <motion.span
            key={total}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-extrabold text-surface-900 dark:text-white"
          >
            ${total.toFixed(2)}
          </motion.span>
        </div>

        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="mt-6">
          <Link
            to="/checkout"
            aria-disabled={cart.length === 0}
            onClick={(event) => cart.length === 0 && event.preventDefault()}
            className={`group inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 font-semibold transition-all ${
              cart.length === 0
                ? 'pointer-events-none bg-black/[0.06] text-surface-500 dark:bg-white/10 dark:text-[#A0AEC0]'
                : 'bg-gradient-to-r from-[#FF6B35] to-[#F97316] text-white shadow-[0_12px_32px_-8px_rgba(255,107,53,0.8)]'
            }`}
          >
            Proceed to checkout
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <p className="mt-4 text-center text-xs text-surface-500 dark:text-[#A0AEC0]">
          Prices include all taxes. Table-side service.
        </p>
      </motion.aside>
    </div>
  );
};

const Row = ({ label, value, accent = 'text-surface-900 dark:text-white' }) => (
  <div className="flex items-center justify-between">
    <dt className="text-surface-600 dark:text-[#A0AEC0]">{label}</dt>
    <dd className={`font-medium ${accent}`}>{value}</dd>
  </div>
);

export default CartPage;
