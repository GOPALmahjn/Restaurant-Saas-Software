import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Heart } from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import MenuCard from '../components/menu/MenuCard';
import { MenuCardSkeleton } from '../components/ui/Skeleton';
import { useFavorites } from '../hooks/useFavorites';
import { fetchMenuItems } from '../services/apiService';
import { categories } from '../data/mockData';

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price ↑' },
  { id: 'price-desc', label: 'Price ↓' },
  { id: 'rating', label: 'Top rated' },
  { id: 'time', label: 'Fastest' },
];

const MenuPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const { favorites } = useFavorites();

  useEffect(() => {
    const load = async () => {
      const data = await fetchMenuItems();
      setItems(data);
      setLoading(false);
    };

    load();
  }, []);

  // Category lives in the URL so home-page links are shareable and Back works.
  useEffect(() => {
    setActiveCategory(searchParams.get('category') || 'all');
  }, [searchParams]);

  const selectCategory = (id) => {
    setActiveCategory(id);
    setSearchParams(id === 'all' ? {} : { category: id }, { replace: true });
  };

  const filteredItems = useMemo(() => {
    const result = items.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' ||
        item.category === activeCategory ||
        item.type === activeCategory;
      const matchesQuery =
        !query || `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase());
      const matchesFavorite = !favoritesOnly || favorites.includes(item.id);
      return matchesCategory && matchesQuery && matchesFavorite;
    });

    const sorted = [...result];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    if (sort === 'time') sorted.sort((a, b) => a.prepTime - b.prepTime);
    if (sort === 'featured') sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    return sorted;
  }, [activeCategory, items, query, sort, favoritesOnly, favorites]);

  return (
    <div className="space-y-8 pt-2">
      {/* Header + search */}
      <div className="flex flex-col gap-6 rounded-[28px] border border-black/[0.07] bg-black/[0.02] p-6 backdrop-blur-xl sm:p-8 lg:flex-row lg:items-end lg:justify-between dark:border-white/10 dark:bg-white/5">
        <SectionTitle
          eyebrow="Explore"
          title="Full restaurant menu"
          description="Browse signatures, bestsellers, and AR-ready dishes."
        />

        <div className="flex flex-wrap gap-2.5">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-surface-900 transition-colors focus-within:border-[#FF6B35]/50 sm:flex-none dark:border-white/10 dark:bg-[#070B16]/60 dark:text-white">
            <Search size={15} className="shrink-0 text-[#FF6B35]" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search dishes"
              aria-label="Search dishes"
              className="w-full bg-transparent outline-none placeholder:text-[#A0AEC0]/70 sm:w-44"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="shrink-0 text-surface-500 hover:text-surface-900 dark:text-[#A0AEC0] dark:hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </label>

          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            aria-expanded={showFilters}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-medium transition-colors ${
              showFilters
                ? 'border-[#FF6B35]/40 bg-[#FF6B35]/12 text-[#FF6B35]'
                : 'border-black/10 bg-black/[0.03] text-surface-900 hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10'
            }`}
          >
            <SlidersHorizontal size={15} /> Filter
          </button>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence initial={false}>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-black/[0.07] bg-black/[0.02] p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <span className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-[#A0AEC0]">
                Sort
              </span>
              {SORTS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSort(option.id)}
                  aria-pressed={sort === option.id}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    sort === option.id
                      ? 'bg-gradient-to-r from-[#FF6B35] to-[#F97316] text-white'
                      : 'bg-black/[0.04] text-surface-600 hover:bg-black/[0.08] hover:text-surface-900 dark:bg-white/5 dark:text-[#A0AEC0] dark:hover:bg-white/10 dark:hover:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}

              <span className="mx-1 h-4 w-px bg-black/10 dark:bg-white/10" aria-hidden="true" />

              <button
                type="button"
                onClick={() => setFavoritesOnly((value) => !value)}
                aria-pressed={favoritesOnly}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  favoritesOnly
                    ? 'bg-[#FF6B35]/15 text-[#FF6B35]'
                    : 'bg-black/[0.04] text-surface-600 hover:bg-black/[0.08] hover:text-surface-900 dark:bg-white/5 dark:text-[#A0AEC0] dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                <Heart size={12} className={favoritesOnly ? 'fill-[#FF6B35]' : ''} />
                Favorites only
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category pills */}
      <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            type="button"
            onClick={() => selectCategory(category.id)}
            whileTap={{ scale: 0.95 }}
            aria-pressed={activeCategory === category.id}
            className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'text-white'
                : 'bg-black/[0.04] text-surface-600 hover:bg-black/[0.08] hover:text-surface-900 dark:bg-white/5 dark:text-[#A0AEC0] dark:hover:bg-white/10 dark:hover:text-white'
            }`}
          >
            {activeCategory === category.id && (
              <motion.span
                layoutId="menu-category-pill"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F97316]"
              />
            )}
            <span className="relative z-10">
              {category.emoji} {category.name}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Result count */}
      {!loading && (
        <p className="text-sm text-surface-600 dark:text-[#A0AEC0]">
          {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'}
          {activeCategory !== 'all' && ' in this category'}
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <MenuCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] p-14 text-center dark:border-white/10 dark:bg-white/5"
        >
          <span className="text-4xl">🔍</span>
          <div>
            <p className="font-semibold text-surface-900 dark:text-white">No dishes found</p>
            <p className="mt-1 text-sm text-surface-600 dark:text-[#A0AEC0]">
              Try a different category or clear your search.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              selectCategory('all');
              setFavoritesOnly(false);
            }}
            className="rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F97316] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Reset filters
          </button>
        </motion.div>
      ) : (
        <motion.div layout className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div key={item.id} layout exit={{ opacity: 0, scale: 0.94 }}>
                <MenuCard item={item} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default MenuPage;
