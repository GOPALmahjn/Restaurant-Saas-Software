import { Star } from 'lucide-react';

/** Star rating. Renders as a single figure by default, or 5 stars when `showStars`. */
const Rating = ({ value, count, showStars = false, className = '' }) => {
  if (showStars) {
    return (
      <div
        className={`flex items-center gap-1 ${className}`}
        role="img"
        aria-label={`Rated ${value} out of 5`}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={14}
            aria-hidden="true"
            className={
              index < Math.round(value)
                ? 'fill-[#FFB347] text-[#FFB347]'
                : 'text-slate-600'
            }
          />
        ))}
        {count ? <span className="ml-1 text-xs text-slate-400">({count})</span> : null}
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold text-[#FFB347] ${className}`}
      aria-label={`Rated ${value} out of 5`}
    >
      <Star size={12} className="fill-[#FFB347]" aria-hidden="true" />
      {value}
      {count ? <span className="font-normal text-slate-400">({count})</span> : null}
    </span>
  );
};

export default Rating;
