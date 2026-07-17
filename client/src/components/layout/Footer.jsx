import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Camera,
  Send,
  ThumbsUp,
  Play,
  QrCode,
  Scan,
  LifeBuoy,
  ShieldCheck,
} from 'lucide-react';
import { restaurant } from '../../data/mockData';

/* lucide-react dropped brand marks, so these use its generic equivalents. */
const SOCIALS = [
  { label: 'Instagram', icon: Camera, href: '#' },
  { label: 'X', icon: Send, href: '#' },
  { label: 'Facebook', icon: ThumbsUp, href: '#' },
  { label: 'YouTube', icon: Play, href: '#' },
];

const EXPERIENCE_LINKS = [
  { label: 'QR Ordering', icon: QrCode, to: '/menu' },
  { label: 'AR Dining', icon: Scan, to: '/ar/1' },
  { label: 'Support', icon: LifeBuoy, to: '/menu' },
  { label: 'Privacy', icon: ShieldCheck, to: '/menu' },
];

const Footer = () => {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/10 bg-[#070B16]">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-[#FF6B35]/12 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand + contact */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FFB347] font-bold text-white shadow-[0_8px_24px_-6px_rgba(255,107,53,0.8)]">
                {restaurant.logo}
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight text-white">{restaurant.name}</p>
                <p className="text-xs text-[#A0AEC0]">AR Dining</p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-[#A0AEC0]">
              {restaurant.tagline}
            </p>

            <ul className="mt-6 space-y-3 text-sm text-[#A0AEC0]">
              <li className="flex items-center gap-3">
                <MapPin size={15} className="shrink-0 text-[#FF6B35]" aria-hidden="true" />
                {restaurant.address}
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="shrink-0 text-[#FF6B35]" aria-hidden="true" />
                <a href={`tel:${restaurant.phone}`} className="transition-colors hover:text-white">
                  {restaurant.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="shrink-0 text-[#FF6B35]" aria-hidden="true" />
                <a href={`mailto:${restaurant.email}`} className="transition-colors hover:text-white">
                  {restaurant.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={15} className="shrink-0 text-[#FF6B35]" aria-hidden="true" />
                {restaurant.openingHours}
              </li>
            </ul>
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
              Experience
            </h3>
            <ul className="mt-5 space-y-3">
              {EXPERIENCE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-2.5 text-sm text-[#A0AEC0] transition-colors hover:text-[#FF6B35]"
                  >
                    <link.icon
                      size={15}
                      className="text-[#A0AEC0] transition-colors group-hover:text-[#FF6B35]"
                      aria-hidden="true"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Follow</h3>
            <p className="mt-5 text-sm leading-relaxed text-[#A0AEC0]">
              Tag your AR plate for a chance to feature on our wall.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {SOCIALS.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#A0AEC0] transition-colors hover:border-[#FF6B35]/40 hover:bg-[#FF6B35]/12 hover:text-[#FF6B35]"
                >
                  <social.icon size={17} aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-[#A0AEC0] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {restaurant.name}. Designed for modern table-side ordering.
          </p>
          <div className="flex flex-wrap gap-5">
            <span className="inline-flex items-center gap-1.5">
              <QrCode size={13} aria-hidden="true" /> QR Ordering
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Scan size={13} aria-hidden="true" /> AR Preview
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={13} aria-hidden="true" /> Secure Checkout
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
