import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  Utensils,
  Wallet,
  Smartphone,
  CreditCard,
  ReceiptText,
  PartyPopper,
  Loader2,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { submitOrder } from '../services/apiService';
import LazyImage from '../components/ui/LazyImage';

const STEPS = [
  { id: 'delivery', label: 'Delivery', icon: Utensils },
  { id: 'payment', label: 'Payment', icon: Wallet },
  { id: 'review', label: 'Review', icon: ReceiptText },
];

/* Values match the original API contract exactly. */
const PAYMENT_METHODS = [
  { value: 'Cash', label: 'Cash', icon: Wallet, hint: 'Pay at the table' },
  { value: 'UPI', label: 'UPI', icon: Smartphone, hint: 'Instant transfer' },
  { value: 'Card', label: 'Card', icon: CreditCard, hint: 'Credit or debit' },
];

const CheckoutPage = () => {
  const { cart, total, subtotal, discount, gst, delivery, selectedTable, setSelectedTable } =
    useRestaurant();
  const [customerName, setCustomerName] = useState('Alicia');
  const [phone, setPhone] = useState('+1 555 0100');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const result = await submitOrder({
      customerName,
      phone,
      table: selectedTable,
      paymentMethod,
      items: cart,
    });
    setSubmitting(false);
    if (result?.success) {
      setOrderNumber(result.orderNumber);
      setSubmitted(true);
    }
  };

  /* ---------------- Success ---------------- */
  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-emerald-400/20 bg-gradient-to-b from-emerald-500/10 to-[#070B16] p-10 text-center"
        >
          {/* Confetti burst */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: 0,
                  x: (Math.cos((index / 18) * Math.PI * 2) * 180),
                  y: (Math.sin((index / 18) * Math.PI * 2) * 180),
                  scale: [0, 1, 0.6],
                }}
                transition={{ duration: 1.4, delay: 0.25, ease: 'easeOut' }}
                className="absolute left-1/2 top-1/3 h-2 w-2 rounded-full"
                style={{
                  backgroundColor: ['#FF6B35', '#FFB347', '#34d399', '#F97316'][index % 4],
                }}
              />
            ))}
          </div>

          {/* Check mark */}
          <motion.div
            initial={{ scale: 0, rotate: -60 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.15 }}
            className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_16px_48px_-8px_rgba(16,185,129,0.8)]"
          >
            <motion.span
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <Check size={38} className="text-white" strokeWidth={3} />
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative mt-6 text-3xl font-extrabold tracking-tight text-white"
          >
            Order confirmed
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#A0AEC0]"
          >
            Your order is being prepared. Keep an eye on the kitchen display for updates.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 300 }}
            className="relative mt-6 inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/25 bg-[#FF6B35]/10 px-5 py-2.5"
          >
            <PartyPopper size={15} className="text-[#FF6B35]" aria-hidden="true" />
            <span className="text-sm font-bold text-[#FF6B35]">Order #{orderNumber}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="relative mt-8 flex flex-wrap justify-center gap-3"
          >
            <Link
              to="/menu"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F97316] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_-8px_rgba(255,107,53,0.8)]"
            >
              Return to menu
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Back home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  /* ---------------- Form ---------------- */
  return (
    <div className="grid gap-8 pt-2 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Checkout</h1>
        <p className="mt-1.5 text-sm text-[#A0AEC0]">
          Enter your details and confirm your table-side order.
        </p>

        {/* Stepper */}
        <div className="mt-7 flex items-center">
          {STEPS.map((entry, index) => {
            const done = index < step;
            const active = index === step;
            return (
              <div key={entry.id} className="flex flex-1 items-center last:flex-none">
                <button
                  type="button"
                  onClick={() => index < step && setStep(index)}
                  disabled={index > step}
                  aria-current={active ? 'step' : undefined}
                  className="flex shrink-0 items-center gap-2 disabled:cursor-default"
                >
                  <motion.span
                    animate={{
                      backgroundColor: done || active ? '#FF6B35' : 'rgba(255,255,255,0.06)',
                      scale: active ? 1.08 : 1,
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                  >
                    {done ? <Check size={15} /> : <entry.icon size={15} />}
                  </motion.span>
                  <span
                    className={`hidden text-xs font-semibold sm:block ${
                      active ? 'text-white' : 'text-[#A0AEC0]'
                    }`}
                  >
                    {entry.label}
                  </span>
                </button>

                {index < STEPS.length - 1 && (
                  <div className="mx-3 h-px flex-1 overflow-hidden bg-white/10">
                    <motion.div
                      initial={false}
                      animate={{ scaleX: done ? 1 : 0 }}
                      transition={{ duration: 0.35 }}
                      className="h-full origin-left bg-gradient-to-r from-[#FF6B35] to-[#FFB347]"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="mt-7">
          <AnimatePresence mode="wait">
            {/* Step 1 — Delivery */}
            {step === 0 && (
              <motion.div
                key="delivery"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <Field label="Customer name" icon={User}>
                  <input
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Customer name"
                    aria-label="Customer name"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#A0AEC0]/60"
                  />
                </Field>

                <Field label="Phone number" icon={Phone}>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Phone number"
                    aria-label="Phone number"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#A0AEC0]/60"
                  />
                </Field>

                <Field label="Table number" icon={Utensils}>
                  <input
                    value={selectedTable}
                    onChange={(event) => setSelectedTable(event.target.value)}
                    placeholder="Table number"
                    aria-label="Table number"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#A0AEC0]/60"
                  />
                </Field>
              </motion.div>
            )}

            {/* Step 2 — Payment */}
            {step === 1 && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                {PAYMENT_METHODS.map((method) => {
                  const active = paymentMethod === method.value;
                  return (
                    <motion.button
                      key={method.value}
                      type="button"
                      onClick={() => setPaymentMethod(method.value)}
                      whileTap={{ scale: 0.98 }}
                      aria-pressed={active}
                      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors ${
                        active
                          ? 'border-[#FF6B35]/50 bg-[#FF6B35]/10'
                          : 'border-white/10 bg-white/5 hover:bg-white/8'
                      }`}
                    >
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                          active ? 'bg-[#FF6B35] text-white' : 'bg-white/5 text-[#A0AEC0]'
                        }`}
                      >
                        <method.icon size={18} />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold text-white">
                          {method.label}
                        </span>
                        <span className="block text-xs text-[#A0AEC0]">{method.hint}</span>
                      </span>
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          active ? 'border-[#FF6B35]' : 'border-white/20'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="payment-dot"
                            className="h-2.5 w-2.5 rounded-full bg-[#FF6B35]"
                          />
                        )}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}

            {/* Step 3 — Review */}
            {step === 2 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                <Summary label="Name" value={customerName} />
                <Summary label="Phone" value={phone} />
                <Summary label="Table" value={selectedTable} />
                <Summary label="Payment" value={paymentMethod} />
                <Summary label="Items" value={`${cart.length} in order`} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav */}
          <div className="mt-7 flex gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((value) => value - 1)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <ArrowLeft size={15} /> Back
              </button>
            )}

            {step < STEPS.length - 1 ? (
              <motion.button
                type="button"
                onClick={() => setStep((value) => value + 1)}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F97316] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_-8px_rgba(255,107,53,0.8)]"
              >
                Continue
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                disabled={submitting || cart.length === 0}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F97316] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_-8px_rgba(255,107,53,0.8)] disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Placing order…
                  </>
                ) : (
                  <>
                    Place order
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </motion.button>
            )}
          </div>
        </form>
      </div>

      {/* Order preview */}
      <motion.aside
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-[28px] border border-white/10 bg-gradient-to-b from-white/8 to-white/4 p-6 backdrop-blur-xl sm:p-8 lg:sticky lg:top-28"
      >
        <h2 className="text-xl font-bold text-white">Order preview</h2>

        {cart.length === 0 ? (
          <p className="mt-5 text-sm text-[#A0AEC0]">
            Your cart is empty —{' '}
            <Link to="/menu" className="text-[#FF6B35] hover:underline">
              add a dish
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {cart.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <LazyImage
                  src={item.image}
                  alt=""
                  wrapperClassName="h-11 w-11 shrink-0 rounded-xl"
                  className="h-11 w-11 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white">{item.name}</p>
                  <p className="text-xs text-[#A0AEC0]">× {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <dl className="mt-6 space-y-2 border-t border-white/10 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-[#A0AEC0]">Subtotal</dt>
            <dd className="text-white">${subtotal.toFixed(2)}</dd>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <dt className="text-[#A0AEC0]">Discount</dt>
              <dd className="text-emerald-400">-${discount.toFixed(2)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-[#A0AEC0]">GST</dt>
            <dd className="text-white">${gst.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[#A0AEC0]">Delivery</dt>
            <dd className="text-white">${delivery.toFixed(2)}</dd>
          </div>
        </dl>

        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="font-semibold text-white">Total</span>
          <span className="text-2xl font-extrabold text-white">${total.toFixed(2)}</span>
        </div>
      </motion.aside>
    </div>
  );
};

const Field = ({ label, icon: Icon, children }) => (
  <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070B16]/50 px-4 py-3 transition-colors focus-within:border-[#FF6B35]/50">
    <Icon size={15} className="shrink-0 text-[#FF6B35]" aria-hidden="true" />
    <span className="sr-only">{label}</span>
    {children}
  </label>
);

const Summary = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
    <span className="text-sm text-[#A0AEC0]">{label}</span>
    <span className="text-sm font-semibold text-white">{value}</span>
  </div>
);

export default CheckoutPage;
