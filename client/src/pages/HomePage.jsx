import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Quote, Scan, QrCode, Sparkles } from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import MenuCard from '../components/menu/MenuCard';
import Hero from '../components/home/Hero';
import CategoryGrid from '../components/home/CategoryGrid';
import SpecialsCarousel from '../components/home/SpecialsCarousel';
import Rating from '../components/ui/Rating';
import { MenuCardSkeleton } from '../components/ui/Skeleton';
import { fetchMenuItems, fetchRestaurantOverview, fetchReviews } from '../services/apiService';

const HomePage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [restaurantData, menuData, reviewData] = await Promise.all([
        fetchRestaurantOverview(),
        fetchMenuItems(),
        fetchReviews(),
      ]);
      setRestaurant(restaurantData);
      setMenu(menuData.slice(0, 3));
      setReviews(reviewData);
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="space-y-16 pt-2 sm:space-y-20">
      {/* Hero renders immediately — no blocking loader */}
      <Hero />

      {/* Quick categories */}
      <section id="categories" className="scroll-mt-28 space-y-6">
        <SectionTitle
          eyebrow="Browse"
          title="Quick categories"
          description="Jump straight to what you're craving — every dish previews in 3D."
          action={
            <Link
              to="/menu"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Full menu
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />
        <CategoryGrid />
      </section>

      {/* Special offers */}
      <section id="specials" className="scroll-mt-28 space-y-6">
        <SectionTitle
          eyebrow="Limited time"
          title="Today's specials"
          description="Chef recommendations, combos, and offers that change with the season."
        />
        <SpecialsCarousel />
      </section>

      {/* Featured dishes */}
      <section className="space-y-6">
        <SectionTitle
          eyebrow="Signature picks"
          title="Featured dishes"
          description="These chef favorites are perfect for a first AR preview."
          action={
            <Link
              to="/menu"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              View all
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }, (_, index) => <MenuCardSkeleton key={index} />)
            : menu.map((item, index) => <MenuCard key={item.id} item={item} index={index} />)}
        </div>
      </section>

      {/* AR call-to-action */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#111A2E] to-[#070B16] p-8 sm:p-12"
      >
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#FF6B35]/20 blur-[90px]"
          aria-hidden="true"
        />
        <div className="pattern-dots pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />

        <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/30 bg-[#FF6B35]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">
              <Sparkles size={12} aria-hidden="true" /> How it works
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Scan the table QR and step into a cinematic dining experience
            </h2>
            <p className="text-sm leading-relaxed text-[#A0AEC0]">
              Point your camera at a flat surface, place the dish, and order — all without
              downloading an app.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/ar/1"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F97316] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_32px_-8px_rgba(255,107,53,0.8)]"
              >
                <Scan size={16} /> Launch AR
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition-colors hover:bg-white/10"
              >
                <QrCode size={16} className="text-[#FF6B35]" /> Browse menu
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Reviews */}
      <section id="reviews" className="scroll-mt-28 space-y-6">
        <SectionTitle
          eyebrow="Guest love"
          title="Customer reviews"
          description="Modern hospitality with immersive technology."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.figure
              key={review.name}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="group animate-fade-in-up relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-colors hover:border-[#FF6B35]/30"
            >
              <Quote
                size={40}
                className="absolute -right-1 -top-1 text-[#FF6B35]/10 transition-colors group-hover:text-[#FF6B35]/20"
                aria-hidden="true"
              />
              <Rating value={review.rating} showStars />
              <blockquote className="mt-4 text-sm leading-relaxed text-white/90">
                “{review.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB347] text-xs font-bold text-white">
                  {review.name.charAt(0)}
                </span>
                <span className="text-sm font-semibold text-white">{review.name}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* Restaurant strip — uses the fetched overview */}
      {restaurant && (
        <section className="animate-fade-in-up flex flex-col items-center gap-2 rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
          <Rating value={restaurant.rating} count={restaurant.reviewCount} showStars />
          <h2 className="mt-2 text-xl font-bold text-white">{restaurant.name}</h2>
          <p className="max-w-lg text-sm text-[#A0AEC0]">{restaurant.tagline}</p>
          <p className="mt-1 text-xs text-[#A0AEC0]">
            {restaurant.address} • {restaurant.openingHours}
          </p>
        </section>
      )}
    </div>
  );
};

export default HomePage;
