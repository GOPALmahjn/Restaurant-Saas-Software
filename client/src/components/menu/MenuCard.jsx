import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Flame, Heart, Scan, Plus, Check, Star } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useFavorites } from '../../hooks/useFavorites';
import LazyImage from '../ui/LazyImage';
import Badge from '../ui/Badge';

const MenuCard = ({ item, index = 0 }) => {
  const { addToCart } = useRestaurant();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [justAdded, setJustAdded] = useState(false);

  const favorite = isFavorite(item.id);
  const discountPercent =
    item.mrp && item.mrp > item.price
      ? Math.round(((item.mrp - item.price) / item.mrp) * 100)
      : 0;

  const handleAdd = () => {
    addToCart(item);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      style={{ animationDelay: `${Math.min(index * 0.06, 0.3)}s` }}
      className="group animate-fade-in-up relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-[#FF6B35]/30 hover:shadow-[0_28px_80px_-16px_rgba(0,0,0,0.8)]"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <LazyImage
          src={item.image}
          alt={item.name}
          wrapperClassName="h-full w-full"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        <div
          className="absolute inset-0 bg-gradient-to-t from-[#070B16] via-[#070B16]/20 to-transparent"
          aria-hidden="true"
        />

        {/* Top-left badges */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          <Badge variant={item.type === 'veg' ? 'veg' : 'non-veg'}>
            {item.type === 'veg' ? 'Veg' : 'Non-Veg'}
          </Badge>
          {discountPercent > 0 && <Badge variant="discount">{discountPercent}% OFF</Badge>}
          {item.isFeatured && <Badge variant="featured">Chef&apos;s pick</Badge>}
        </div>

        {/* Favorite */}
        <motion.button
          type="button"
          onClick={() => toggleFavorite(item.id)}
          whileTap={{ scale: 0.8 }}
          aria-label={favorite ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
          aria-pressed={favorite}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#070B16]/60 backdrop-blur-xl transition-colors hover:bg-[#070B16]/80"
        >
          <motion.span
            animate={favorite ? { scale: [1, 1.35, 1] } : { scale: 1 }}
            transition={{ duration: 0.35 }}
            className="block"
          >
            <Heart
              size={15}
              className={favorite ? 'fill-[#FF6B35] text-[#FF6B35]' : 'text-white'}
            />
          </motion.span>
        </motion.button>

        {/* Rating chip */}
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#070B16]/75 px-2.5 py-1 backdrop-blur-xl">
          <Star size={11} className="fill-[#FFB347] text-[#FFB347]" aria-hidden="true" />
          <span className="text-[11px] font-bold text-white">{item.rating}</span>
        </div>

        {/* AR preview — reveals on hover, stays reachable by keyboard */}
        <div className="absolute bottom-3 right-3 translate-y-2 opacity-0 transition-all duration-300 focus-within:translate-y-0 focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
          <Link
            to={`/ar/${item.id}`}
            aria-label={`Preview ${item.name} in augmented reality`}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FFB347] px-3 py-1.5 text-[11px] font-bold text-white shadow-[0_8px_20px_-6px_rgba(255,107,53,0.9)]"
          >
            <Scan size={12} />
            AR Preview
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <Link to={`/menu/${item.id}`} className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-white transition-colors hover:text-[#FF6B35]">
              {item.name}
            </h3>
          </Link>

          <div className="shrink-0 text-right">
            <div className="flex items-baseline gap-1.5">
              {discountPercent > 0 && (
                <span className="text-xs text-[#A0AEC0] line-through">${item.mrp}</span>
              )}
              <span className="text-lg font-bold text-[#FF6B35]">${item.price}</span>
            </div>
          </div>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-[#A0AEC0]">{item.description}</p>

        {/* Meta */}
        <div className="flex flex-wrap gap-1.5 text-[11px] text-[#A0AEC0]">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1">
            <Clock size={11} aria-hidden="true" /> {item.prepTime} min
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1">
            <Flame size={11} aria-hidden="true" /> {item.calories} kcal
          </span>
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2 pt-2">
          <Link
            to={`/menu/${item.id}`}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
          >
            Details
          </Link>

          <motion.button
            type="button"
            onClick={handleAdd}
            whileTap={{ scale: 0.94 }}
            aria-label={`Add ${item.name} to cart`}
            className={`relative inline-flex flex-1 items-center justify-center gap-1.5 overflow-hidden rounded-full px-3 py-2.5 text-xs font-semibold text-white transition-colors ${
              justAdded
                ? 'bg-emerald-500'
                : 'bg-gradient-to-r from-[#FF6B35] to-[#F97316] shadow-[0_8px_20px_-8px_rgba(255,107,53,0.9)]'
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {justAdded ? (
                <motion.span
                  key="added"
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="inline-flex items-center gap-1.5"
                >
                  <Check size={13} /> Added
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="inline-flex items-center gap-1.5"
                >
                  <Plus size={13} /> Add
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default MenuCard;
