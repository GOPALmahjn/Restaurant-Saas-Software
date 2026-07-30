import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LazyImage from '../ui/LazyImage';
import { categoryCards } from '../../data/mockData';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const card = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * Quick-category cards. Selecting one deep-links to the menu with the
 * category pre-applied via ?category= — MenuPage reads it on mount.
 */
const CategoryGrid = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
    >
      {categoryCards.map((category) => (
        <motion.button
          key={category.id}
          type="button"
          variants={card}
          whileHover={{ y: -8 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={() => navigate(`/menu?category=${category.id}`)}
          aria-label={`Browse ${category.name}`}
          className="group relative overflow-hidden rounded-3xl border border-black/10 bg-black/[0.03] p-0 text-left backdrop-blur-xl transition-colors hover:border-[#FF6B35]/40 dark:border-white/10 dark:bg-white/5"
        >
          {/* Food image */}
          <div className="relative h-24 w-full overflow-hidden sm:h-28">
            <LazyImage
              src={category.image}
              alt=""
              wrapperClassName="h-full w-full"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t ${category.gradient}`}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#070B16] via-[#070B16]/40 to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* Label */}
          <div className="relative flex items-center gap-2 px-3 py-3">
            <motion.span
              className="text-xl"
              whileHover={{ scale: 1.25, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 400 }}
              aria-hidden="true"
            >
              {category.emoji}
            </motion.span>
            <span className="text-sm font-semibold text-surface-900 transition-colors group-hover:text-[#FF6B35] dark:text-white">
              {category.name}
            </span>
          </div>

          {/* Hover glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ boxShadow: 'inset 0 0 40px rgba(255,107,53,0.25)' }}
            aria-hidden="true"
          />
        </motion.button>
      ))}
    </motion.div>
  );
};

export default CategoryGrid;
