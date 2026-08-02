import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  LogOut,
  Loader2,
  Check,
  ShieldCheck,
  Globe,
  Bell,
  Heart,
  CalendarDays,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 size={26} className="animate-spin text-[#FF6B35]" aria-label="Loading profile" />
      </div>
    );
  }

  return isAuthenticated ? (
    <ProfileView user={user} onLogout={logout} />
  ) : (
    <AuthForms />
  );
};

/* ------------------------------------------------------------------ */
/* Logged-in view                                                      */
/* ------------------------------------------------------------------ */

const ProfileView = ({ user, onLogout }) => {
  const { updateProfile } = useAuth();
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [language, setLanguage] = useState(user.preferences?.language || 'en');
  const [notifications, setNotifications] = useState(user.preferences?.notifications ?? true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Reflect external user changes (e.g. re-hydration) back into the form.
  useEffect(() => {
    setName(user.name || '');
    setPhone(user.phone || '');
    setLanguage(user.preferences?.language || 'en');
    setNotifications(user.preferences?.notifications ?? true);
  }, [user]);

  const dirty =
    name !== (user.name || '') ||
    phone !== (user.phone || '') ||
    language !== (user.preferences?.language || 'en') ||
    notifications !== (user.preferences?.notifications ?? true);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await updateProfile({
        name,
        phone,
        preferences: { language, notifications },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const initials = (user.name || user.email || '?').trim().charAt(0).toUpperCase();
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    : null;

  return (
    <div className="grid gap-8 pt-2 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      {/* Identity card */}
      <motion.aside
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[28px] border border-black/[0.07] bg-black/[0.02] p-6 backdrop-blur-xl sm:p-8 lg:sticky lg:top-28 dark:border-white/10 dark:bg-gradient-to-b dark:from-white/8 dark:to-white/4"
      >
        <div className="flex flex-col items-center text-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="h-24 w-24 rounded-full object-cover shadow-[0_16px_48px_-8px_rgba(255,107,53,0.6)]"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB347] text-4xl font-bold text-white shadow-[0_16px_48px_-8px_rgba(255,107,53,0.7)]">
              {initials}
            </div>
          )}
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
            {user.name}
          </h1>
          <p className="mt-1 text-sm text-surface-600 dark:text-[#A0AEC0]">{user.email}</p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#FF6B35]/25 bg-[#FF6B35]/10 px-3 py-1 text-xs font-semibold capitalize text-[#FF6B35]">
            <ShieldCheck size={13} /> {user.role || 'customer'}
          </span>
        </div>

        <dl className="mt-7 space-y-3 border-t border-black/10 pt-5 text-sm dark:border-white/10">
          <Stat icon={Heart} label="Favorites" value={`${user.favorites?.length || 0} saved`} />
          {memberSince && <Stat icon={CalendarDays} label="Member since" value={memberSince} />}
        </dl>

        <button
          type="button"
          onClick={onLogout}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/20 dark:text-red-400"
        >
          <LogOut size={15} /> Log out
        </button>
      </motion.aside>

      {/* Edit form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-[28px] border border-black/[0.07] bg-black/[0.02] p-6 backdrop-blur-xl sm:p-8 dark:border-white/10 dark:bg-white/5"
      >
        <h2 className="text-xl font-bold tracking-tight text-surface-900 dark:text-white">
          Account details
        </h2>
        <p className="mt-1.5 text-sm text-surface-600 dark:text-[#A0AEC0]">
          Update your personal information and preferences.
        </p>

        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <Field label="Full name" icon={User}>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="w-full bg-transparent text-sm text-surface-900 outline-none placeholder:text-[#A0AEC0]/60 dark:text-white"
            />
          </Field>

          <Field label="Email" icon={Mail} muted>
            <input
              value={user.email}
              readOnly
              aria-readonly="true"
              className="w-full cursor-not-allowed bg-transparent text-sm text-surface-500 outline-none dark:text-[#A0AEC0]"
            />
          </Field>

          <Field label="Phone number" icon={Phone}>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Add a phone number"
              className="w-full bg-transparent text-sm text-surface-900 outline-none placeholder:text-[#A0AEC0]/60 dark:text-white"
            />
          </Field>

          {/* Preferences */}
          <div className="rounded-2xl border border-black/[0.07] bg-black/[0.02] p-4 dark:border-white/10 dark:bg-[#070B16]/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-[#A0AEC0]">
              Preferences
            </p>

            <label className="mt-3 flex items-center gap-3">
              <Globe size={15} className="shrink-0 text-[#FF6B35]" aria-hidden="true" />
              <span className="flex-1 text-sm text-surface-900 dark:text-white">Language</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-sm text-surface-900 outline-none dark:border-white/10 dark:bg-[#070B16] dark:text-white"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </label>

            <button
              type="button"
              onClick={() => setNotifications((value) => !value)}
              aria-pressed={notifications}
              className="mt-3 flex w-full items-center gap-3"
            >
              <Bell size={15} className="shrink-0 text-[#FF6B35]" aria-hidden="true" />
              <span className="flex-1 text-left text-sm text-surface-900 dark:text-white">
                Order notifications
              </span>
              <span
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  notifications ? 'bg-[#FF6B35]' : 'bg-black/15 dark:bg-white/15'
                }`}
              >
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${
                    notifications ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </span>
            </button>
          </div>

          {error && (
            <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-500 dark:text-red-400">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={saving || !dirty}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F97316] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_-8px_rgba(255,107,53,0.8)] disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Saving…
              </>
            ) : saved ? (
              <>
                <Check size={15} /> Saved
              </>
            ) : (
              'Save changes'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Logged-out view — login / register                                  */
/* ------------------------------------------------------------------ */

const AuthForms = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await register({ name, email, phone, password });
      }
      // On success the provider sets `user`; ProfilePage re-renders to the view.
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[55vh] items-center justify-center pt-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className="w-full max-w-md rounded-[28px] border border-black/[0.07] bg-black/[0.02] p-6 backdrop-blur-xl sm:p-8 dark:border-white/10 dark:bg-white/5"
      >
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FFB347] text-white shadow-[0_12px_32px_-8px_rgba(255,107,53,0.7)]">
            <User size={24} />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-1.5 text-sm text-surface-600 dark:text-[#A0AEC0]">
            {mode === 'login'
              ? 'Sign in to manage your profile and orders.'
              : 'Join to save favorites and track your orders.'}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="mt-6 grid grid-cols-2 rounded-full border border-black/[0.07] bg-black/[0.03] p-1 dark:border-white/10 dark:bg-white/5">
          {['login', 'register'].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setMode(value);
                setError('');
              }}
              className="relative rounded-full py-2 text-sm font-semibold capitalize"
            >
              {mode === value && (
                <motion.span
                  layoutId="auth-mode-pill"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F97316]"
                />
              )}
              <span
                className={`relative z-10 ${
                  mode === value ? 'text-white' : 'text-surface-600 dark:text-[#A0AEC0]'
                }`}
              >
                {value === 'login' ? 'Sign in' : 'Register'}
              </span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {mode === 'register' && (
              <motion.div
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Field label="Full name" icon={User}>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    placeholder="Your name"
                    className="w-full bg-transparent text-sm text-surface-900 outline-none placeholder:text-[#A0AEC0]/60 dark:text-white"
                  />
                </Field>
              </motion.div>
            )}
          </AnimatePresence>

          <Field label="Email" icon={Mail}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
              className="w-full bg-transparent text-sm text-surface-900 outline-none placeholder:text-[#A0AEC0]/60 dark:text-white"
            />
          </Field>

          <AnimatePresence mode="popLayout">
            {mode === 'register' && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Field label="Phone (optional)" icon={Phone}>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Phone number"
                    className="w-full bg-transparent text-sm text-surface-900 outline-none placeholder:text-[#A0AEC0]/60 dark:text-white"
                  />
                </Field>
              </motion.div>
            )}
          </AnimatePresence>

          <Field label="Password" icon={Lock}>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full bg-transparent text-sm text-surface-900 outline-none placeholder:text-[#A0AEC0]/60 dark:text-white"
            />
          </Field>

          {error && (
            <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-500 dark:text-red-400">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={submitting}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F97316] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_-8px_rgba(255,107,53,0.8)] disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                {mode === 'login' ? 'Signing in…' : 'Creating account…'}
              </>
            ) : (
              <>
                {mode === 'login' ? 'Sign in' : 'Create account'}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-xs text-surface-500 dark:text-[#A0AEC0]">
          Just browsing?{' '}
          <Link to="/menu" className="text-[#FF6B35] hover:underline">
            Explore the menu
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

const Field = ({ label, icon: Icon, muted, children }) => (
  <label
    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors focus-within:border-[#FF6B35]/50 ${
      muted
        ? 'border-black/[0.05] bg-black/[0.02] dark:border-white/[0.06] dark:bg-[#070B16]/30'
        : 'border-black/[0.07] bg-black/[0.03] dark:border-white/10 dark:bg-[#070B16]/50'
    }`}
  >
    <Icon size={15} className="shrink-0 text-[#FF6B35]" aria-hidden="true" />
    <span className="sr-only">{label}</span>
    {children}
  </label>
);

const Stat = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <Icon size={15} className="shrink-0 text-[#FF6B35]" aria-hidden="true" />
    <span className="flex-1 text-surface-600 dark:text-[#A0AEC0]">{label}</span>
    <span className="font-semibold text-surface-900 dark:text-white">{value}</span>
  </div>
);

export default ProfilePage;
