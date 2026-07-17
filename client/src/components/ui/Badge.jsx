const VARIANTS = {
  veg: 'border-emerald-400/30 bg-emerald-500/12 text-emerald-300',
  'non-veg': 'border-red-400/30 bg-red-500/12 text-red-300',
  featured: 'border-transparent bg-gradient-to-r from-[#FFB347] to-[#FF6B35] text-white',
  ar: 'border-transparent bg-gradient-to-r from-[#FF6B35] to-[#FFB347] text-white',
  discount: 'border-transparent bg-gradient-to-r from-[#FF6B35] to-[#F97316] text-white',
  neutral: 'border-white/10 bg-white/5 text-slate-300',
};

/**
 * Small pill label. `variant="veg" | "non-veg"` also renders the
 * regulatory square-dot dietary indicator.
 */
const Badge = ({ children, variant = 'neutral', className = '' }) => {
  const isDietary = variant === 'veg' || variant === 'non-veg';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${VARIANTS[variant] || VARIANTS.neutral} ${className}`}
    >
      {isDietary && (
        <span
          className={variant === 'veg' ? 'veg-indicator' : 'non-veg-indicator'}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
