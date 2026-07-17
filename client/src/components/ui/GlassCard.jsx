import { motion } from 'framer-motion';

/**
 * Frosted surface used for nearly every panel in the app.
 * `hover` adds the spring lift; `as` swaps the rendered element.
 */
const GlassCard = ({
  children,
  className = '',
  hover = false,
  as = 'div',
  ...props
}) => {
  const Component = motion[as] || motion.div;

  return (
    <Component
      whileHover={hover ? { y: -6 } : undefined}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl ${
        hover ? 'transition-shadow hover:shadow-[0_24px_80px_-12px_rgba(0,0,0,0.6)]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default GlassCard;
