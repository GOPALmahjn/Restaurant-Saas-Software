import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, X, CornerDownLeft } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { menuItems } from '../../data/mockData';
import LazyImage from '../ui/LazyImage';

/** Command-palette style dish search. Arrow keys navigate, Enter opens. */
const SearchModal = () => {
  const { isSearchOpen, closeSearch } = useUI();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return menuItems.slice(0, 5);
    const needle = query.toLowerCase();
    return menuItems
      .filter((item) =>
        `${item.name} ${item.description} ${item.category} ${item.tags?.join(' ')}`
          .toLowerCase()
          .includes(needle),
      )
      .slice(0, 6);
  }, [query]);

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setActiveIndex(0);
      // Wait for the entry animation before stealing focus.
      const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
      return () => window.clearTimeout(timer);
    }
  }, [isSearchOpen]);

  useEffect(() => setActiveIndex(0), [query]);

  const openDish = (id) => {
    closeSearch();
    navigate(`/menu/${id}`);
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % Math.max(results.length, 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % Math.max(results.length, 1));
    }
    if (event.key === 'Enter' && results[activeIndex]) {
      openDish(results[activeIndex].id);
    }
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search dishes"
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed left-1/2 top-[12vh] z-[71] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-3xl border border-white/10 bg-[#070B16]/95 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
              <Search size={17} className="shrink-0 text-[#FF6B35]" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search dishes, categories, tags…"
                aria-label="Search dishes"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#A0AEC0]/70"
              />
              <button
                type="button"
                onClick={closeSearch}
                aria-label="Close search"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#A0AEC0] transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            <div className="scrollbar-thin max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="px-3 py-10 text-center text-sm text-[#A0AEC0]">
                  No dishes match “{query}”.
                </p>
              ) : (
                <ul>
                  {results.map((item, index) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => openDish(item.id)}
                        onMouseEnter={() => setActiveIndex(index)}
                        aria-current={index === activeIndex}
                        className={`flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-colors ${
                          index === activeIndex ? 'bg-white/8' : 'hover:bg-white/5'
                        }`}
                      >
                        <LazyImage
                          src={item.image}
                          alt=""
                          wrapperClassName="h-11 w-11 shrink-0 rounded-xl"
                          className="h-11 w-11 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">{item.name}</p>
                          <p className="truncate text-xs text-[#A0AEC0]">{item.description}</p>
                        </div>
                        <span className="shrink-0 text-sm font-semibold text-[#FF6B35]">
                          ${item.price}
                        </span>
                        {index === activeIndex && (
                          <CornerDownLeft
                            size={13}
                            className="shrink-0 text-[#A0AEC0]"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center gap-3 border-t border-white/10 px-4 py-2.5 text-[11px] text-[#A0AEC0]">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
