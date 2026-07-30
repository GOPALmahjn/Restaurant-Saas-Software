import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Scan } from 'lucide-react';
import LazyImage from '../ui/LazyImage';
import { specials } from '../../data/mockData';

const AUTOPLAY_MS = 6000;

const slideVariants = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? 80 : -80 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction > 0 ? -80 : 80 }),
};

/** Auto-playing offers carousel. Pauses on hover/focus; swipeable on touch. */
const SpecialsCarousel = () => {
  const [[index, direction], setSlide] = useState([0, 0]);
  const [paused, setPaused] = useState(false);

  const paginate = useCallback((step) => {
    setSlide(([current]) => [
      (current + step + specials.length) % specials.length,
      step,
    ]);
  }, []);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, paginate]);

  const slide = specials[index];

  return (
    <div
      className="relative overflow-hidden rounded-[28px] border border-black/10 bg-[#0B1120] backdrop-blur-xl dark:border-white/10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Special offers"
    >
      <div className="relative h-[380px] sm:h-[320px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={slide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) paginate(1);
              if (info.offset.x > 60) paginate(-1);
            }}
            className="absolute inset-0 grid cursor-grab active:cursor-grabbing sm:grid-cols-2"
          >
            {/* Copy */}
            <div className="relative z-10 flex flex-col justify-center gap-4 p-6 sm:p-9">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F97316] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  {slide.badge}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A0AEC0]">
                  {slide.label}
                </span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {slide.title}
              </h3>

              <p className="max-w-sm text-sm leading-relaxed text-[#A0AEC0]">
                {slide.description}
              </p>

              <div className="flex flex-wrap gap-2.5 pt-1">
                <Link
                  to={`/menu/${slide.dishId}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F97316] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-6px_rgba(255,107,53,0.7)]"
                >
                  Order now
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to={`/ar/${slide.dishId}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Scan size={14} className="text-[#FF6B35]" />
                  View in AR
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="absolute inset-0 sm:relative">
              <LazyImage
                src={slide.image}
                alt={slide.title}
                wrapperClassName="h-full w-full"
                className="h-full w-full object-cover"
                draggable={false}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slide.accent}`}
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-[#070B16] via-[#070B16]/85 to-[#070B16]/30 sm:from-[#070B16] sm:via-[#070B16]/60 sm:to-transparent"
                aria-hidden="true"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <button
        type="button"
        onClick={() => paginate(-1)}
        aria-label="Previous offer"
        className="absolute left-3 top-1/2 z-20 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#070B16]/70 text-white backdrop-blur-xl transition-colors hover:bg-[#FF6B35]/25"
      >
        <ChevronLeft size={17} />
      </button>
      <button
        type="button"
        onClick={() => paginate(1)}
        aria-label="Next offer"
        className="absolute right-3 top-1/2 z-20 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#070B16]/70 text-white backdrop-blur-xl transition-colors hover:bg-[#FF6B35]/25"
      >
        <ChevronRight size={17} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-6 z-20 flex gap-1.5 sm:left-9">
        {specials.map((entry, dotIndex) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setSlide([dotIndex, dotIndex > index ? 1 : -1])}
            aria-label={`Go to offer ${dotIndex + 1}: ${entry.title}`}
            aria-current={dotIndex === index}
            className="group py-2"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                dotIndex === index
                  ? 'w-7 bg-gradient-to-r from-[#FF6B35] to-[#FFB347]'
                  : 'w-1.5 bg-white/25 group-hover:bg-white/50'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SpecialsCarousel;
