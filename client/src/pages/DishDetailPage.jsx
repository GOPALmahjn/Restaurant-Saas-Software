import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Flame,
  Scan,
  ShieldAlert,
  Heart,
  Plus,
  Check,
  Leaf,
} from 'lucide-react';
import { fetchDishById } from '../services/apiService';
import { useRestaurant } from '../context/RestaurantContext';
import { useFavorites } from '../hooks/useFavorites';
import LazyImage from '../components/ui/LazyImage';
import Badge from '../components/ui/Badge';
import Rating from '../components/ui/Rating';
import { Skeleton } from '../components/ui/Skeleton';

const DishDetailPage = () => {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart } = useRestaurant();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const loadDish = async () => {
      const data = await fetchDishById(id);
      setDish(data);
      setActiveImage(0);
    };

    loadDish();
  }, [id]);

  if (!dish) {
    return (
      <div className="grid gap-8 pt-2 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Skeleton className="h-[420px] w-full rounded-[28px]" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
          </div>
        </div>
        <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-8">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
      </div>
    );
  }

  const gallery = dish.images?.length ? dish.images : [dish.image];
  const favorite = isFavorite(dish.id);
  const discountPercent =
    dish.mrp && dish.mrp > dish.price
      ? Math.round(((dish.mrp - dish.price) / dish.mrp) * 100)
      : 0;

  const handleAdd = () => {
    addToCart(dish);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <div className="space-y-8 pt-2">
      <Link
        to="/menu"
        className="inline-flex items-center gap-2 text-sm text-[#A0AEC0] transition-colors hover:text-white"
      >
        <ArrowLeft size={15} /> Back to menu
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[28px] border border-white/10"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <LazyImage
                  src={gallery[activeImage]}
                  alt={`${dish.name} — view ${activeImage + 1}`}
                  wrapperClassName="h-[300px] w-full sm:h-[420px]"
                  className="h-[300px] w-full object-cover sm:h-[420px]"
                />
              </motion.div>
            </AnimatePresence>

            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070B16]/70 to-transparent"
              aria-hidden="true"
            />

            <div className="absolute left-4 top-4 flex flex-col gap-2">
              <Badge variant={dish.type === 'veg' ? 'veg' : 'non-veg'}>
                {dish.type === 'veg' ? 'Veg' : 'Non-Veg'}
              </Badge>
              {discountPercent > 0 && <Badge variant="discount">{discountPercent}% OFF</Badge>}
            </div>

            <motion.button
              type="button"
              onClick={() => toggleFavorite(dish.id)}
              whileTap={{ scale: 0.85 }}
              aria-pressed={favorite}
              aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#070B16]/70 backdrop-blur-xl"
            >
              <Heart
                size={16}
                className={favorite ? 'fill-[#FF6B35] text-[#FF6B35]' : 'text-white'}
              />
            </motion.button>
          </motion.div>

          {gallery.length > 1 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {gallery.slice(0, 3).map((image, index) => (
                <motion.button
                  key={`${dish.id}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  whileHover={{ y: -4 }}
                  aria-label={`View image ${index + 1}`}
                  aria-current={activeImage === index}
                  className={`overflow-hidden rounded-3xl border-2 transition-colors ${
                    activeImage === index ? 'border-[#FF6B35]' : 'border-white/10'
                  }`}
                >
                  <LazyImage
                    src={image}
                    alt=""
                    wrapperClassName="h-24 w-full sm:h-28"
                    className="h-24 w-full object-cover sm:h-28"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8 lg:sticky lg:top-28"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#FF6B35]">
                Chef signature
              </span>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
                {dish.name}
              </h1>
              <div className="mt-2">
                <Rating value={dish.rating} showStars />
              </div>
            </div>

            <div className="shrink-0 rounded-2xl bg-[#FF6B35]/12 px-4 py-2.5 text-right">
              {discountPercent > 0 && (
                <span className="block text-xs text-[#A0AEC0] line-through">${dish.mrp}</span>
              )}
              <span className="text-xl font-extrabold text-[#FF6B35]">${dish.price}</span>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-[#A0AEC0]">{dish.description}</p>

          {/* Meta */}
          <div className="grid grid-cols-3 gap-2.5">
            <Stat icon={Clock} value={`${dish.prepTime} min`} label="Prep time" />
            <Stat icon={Flame} value={`${dish.calories}`} label="Calories" />
            <Stat icon={Leaf} value={dish.type === 'veg' ? 'Veg' : 'Non-Veg'} label="Dietary" />
          </div>

          {/* Ingredients */}
          {dish.ingredients?.length ? (
            <section>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">
                Ingredients
              </h2>
              <div className="flex flex-wrap gap-2">
                {dish.ingredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="rounded-full border border-white/10 bg-[#070B16]/50 px-3 py-1.5 text-xs text-[#A0AEC0]"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {/* Allergens */}
          {dish.allergens?.length ? (
            <section>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">
                Allergen info
              </h2>
              <div className="flex flex-wrap gap-2">
                {dish.allergens.map((allergen) => (
                  <span
                    key={allergen}
                    className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-200"
                  >
                    <ShieldAlert size={12} aria-hidden="true" /> {allergen}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {/* Nutrition */}
          {dish.nutritionFacts ? (
            <section>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">
                Nutrition
              </h2>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {Object.entries(dish.nutritionFacts).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-2xl border border-white/10 bg-[#070B16]/40 p-2.5 text-center"
                  >
                    <p className="text-sm font-bold text-white">{value}</p>
                    <p className="mt-0.5 text-[10px] capitalize text-[#A0AEC0]">{key}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* Actions */}
          <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
            <motion.button
              type="button"
              onClick={handleAdd}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              aria-label={`Add ${dish.name} to cart`}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold text-white transition-colors ${
                justAdded
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-[#FF6B35] to-[#F97316] shadow-[0_12px_32px_-8px_rgba(255,107,53,0.8)]'
              }`}
            >
              {justAdded ? (
                <>
                  <Check size={16} /> Added to cart
                </>
              ) : (
                <>
                  <Plus size={16} /> Add to cart
                </>
              )}
            </motion.button>

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="flex-1">
              <Link
                to={`/ar/${dish.id}`}
                className="ar-pulse inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Scan size={16} className="text-[#FF6B35]" /> View in AR
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Stat = ({ icon: Icon, value, label }) => (
  <div className="rounded-2xl border border-white/10 bg-[#070B16]/40 p-3 text-center">
    <Icon size={15} className="mx-auto text-[#FF6B35]" aria-hidden="true" />
    <p className="mt-1.5 text-sm font-bold text-white">{value}</p>
    <p className="text-[10px] text-[#A0AEC0]">{label}</p>
  </div>
);

export default DishDetailPage;
