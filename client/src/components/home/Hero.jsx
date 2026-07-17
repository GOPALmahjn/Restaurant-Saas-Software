import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { Scan, ArrowRight, Star, MapPin, Clock, Sparkles } from 'lucide-react';
import LazyImage from '../ui/LazyImage';
import { restaurant } from '../../data/mockData';

/* Decorative food illustrations that drift behind the hero. */
const FLOATERS = [
  { emoji: '🍕', className: 'left-[6%] top-[18%]', delay: 0, duration: 7 },
  { emoji: '🍔', className: 'right-[10%] top-[12%]', delay: 1.2, duration: 8 },
  { emoji: '🥗', className: 'left-[14%] bottom-[16%]', delay: 0.6, duration: 9 },
  { emoji: '🍝', className: 'right-[18%] bottom-[22%]', delay: 1.8, duration: 7.5 },
  { emoji: '🥤', className: 'left-[46%] top-[8%]', delay: 2.4, duration: 8.5 },
  { emoji: '🍰', className: 'right-[40%] bottom-[10%]', delay: 0.9, duration: 9.5 },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const Hero = () => {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Parallax: image drifts up, copy fades as you scroll away.
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -60]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 80]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.8], [1, reduceMotion ? 1 : 0.3]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-[#111A2E] to-[#070B16] px-6 py-14 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] sm:px-10 sm:py-20 lg:px-14"
    >
      {/* Glowing gradient orbs */}
      <motion.div style={{ y: glowY }} className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#FF6B35]/25 blur-[100px]" />
        <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[#FFB347]/18 blur-[110px]" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F97316]/12 blur-[90px]" />
      </motion.div>

      {/* Grid texture */}
      <div className="pattern-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      {/* Floating food illustrations */}
      {!reduceMotion && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {FLOATERS.map((floater) => (
            <motion.span
              key={floater.emoji}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 0.22,
                scale: 1,
                y: [0, -22, 0],
                rotate: [0, 8, -8, 0],
              }}
              transition={{
                opacity: { duration: 1, delay: floater.delay },
                scale: { duration: 1, delay: floater.delay },
                y: { duration: floater.duration, repeat: Infinity, ease: 'easeInOut', delay: floater.delay },
                rotate: { duration: floater.duration * 1.6, repeat: Infinity, ease: 'easeInOut' },
              }}
              className={`absolute select-none text-4xl blur-[1px] sm:text-6xl ${floater.className}`}
            >
              {floater.emoji}
            </motion.span>
          ))}
        </div>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]"
      >
        {/* Copy */}
        <motion.div style={{ opacity: copyOpacity }} className="space-y-7">
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/30 bg-[#FF6B35]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#FF6B35] backdrop-blur-xl">
              <Sparkles size={13} aria-hidden="true" />
              Premium AR menu experience
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Experience Dining in{' '}
            <span className="relative inline-block">
              <span className="gradient-text">Augmented Reality</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.7, ease: 'easeOut' }}
                className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-gradient-to-r from-[#FF6B35] to-transparent"
              />
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-lg font-medium tracking-wide text-[#A0AEC0]"
          >
            Scan <span className="text-[#FF6B35]">•</span> View in 3D{' '}
            <span className="text-[#FF6B35]">•</span> Order Instantly
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-3">
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/menu"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F97316] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_32px_-8px_rgba(255,107,53,0.8)] transition-shadow hover:shadow-[0_16px_40px_-8px_rgba(255,107,53,1)]"
              >
                View Menu
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/ar/1"
                className="ar-pulse inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition-colors hover:bg-white/10"
              >
                <Scan size={16} className="text-[#FF6B35]" />
                Launch AR Experience
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={item}
            className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#A0AEC0]"
          >
            <span className="inline-flex items-center gap-2">
              <Star size={14} className="fill-[#FFB347] text-[#FFB347]" aria-hidden="true" />
              <span className="font-semibold text-white">{restaurant.rating}</span>
              <span>({restaurant.reviewCount.toLocaleString()} reviews)</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin size={14} className="text-[#FF6B35]" aria-hidden="true" />
              {restaurant.address}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock size={14} className="text-[#FF6B35]" aria-hidden="true" />
              {restaurant.openingHours}
            </span>
          </motion.div>
        </motion.div>

        {/* Banner */}
        <motion.div variants={item} style={{ y: imageY }} className="relative">
          <div
            className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-[#FF6B35]/40 to-[#FFB347]/20 blur-3xl"
            aria-hidden="true"
          />

          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -14, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <LazyImage
              src={restaurant.featuredImage}
              alt={`${restaurant.name} signature table setting`}
              wrapperClassName="rounded-[28px] border border-white/12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]"
              className="h-[300px] w-full object-cover sm:h-[420px]"
            />

            {/* Floating stat cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -left-3 top-8 flex items-center gap-2.5 rounded-2xl border border-white/12 bg-[#070B16]/85 px-3.5 py-2.5 backdrop-blur-xl sm:-left-6"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF6B35]/15 text-[#FF6B35]">
                <Scan size={15} />
              </span>
              <div>
                <p className="text-xs font-semibold text-white">3D Preview</p>
                <p className="text-[10px] text-[#A0AEC0]">Every dish</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -right-3 bottom-8 flex items-center gap-2.5 rounded-2xl border border-white/12 bg-[#070B16]/85 px-3.5 py-2.5 backdrop-blur-xl sm:-right-6"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <Clock size={15} />
              </span>
              <div>
                <p className="text-xs font-semibold text-white">12 min avg</p>
                <p className="text-[10px] text-[#A0AEC0]">To your table</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
