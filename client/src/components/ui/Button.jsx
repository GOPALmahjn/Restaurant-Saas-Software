import { useState } from 'react';
import { motion } from 'framer-motion';

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-[#FF6B35] to-[#F97316] text-white shadow-[0_8px_24px_-6px_rgba(255,107,53,0.6)] hover:shadow-[0_12px_32px_-6px_rgba(255,107,53,0.8)]',
  secondary:
    'border border-white/15 bg-white/5 text-white backdrop-blur-xl hover:bg-white/10',
  ghost: 'text-slate-300 hover:bg-white/5 hover:text-white',
  danger: 'bg-red-500/15 text-red-300 hover:bg-red-500/25',
};

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-3 text-sm',
  lg: 'px-7 py-4 text-base',
};

/**
 * Primary action button with a material-style ripple on press.
 * Defaults to type="button" to stay drop-in compatible with prior usage;
 * pass type="submit" for forms.
 */
const Button = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const [ripples, setRipples] = useState([]);

  const spawnRipple = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ripple = {
      id: `${Date.now()}-${ripples.length}`,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    setRipples((current) => [...current, ripple]);
    window.setTimeout(
      () => setRipples((current) => current.filter((entry) => entry.id !== ripple.id)),
      600,
    );
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onPointerDown={spawnRipple}
      className={`relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-all duration-200 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ left: ripple.x, top: ripple.y }}
          className="pointer-events-none absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30"
        />
      ))}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </motion.button>
  );
};

export default Button;
