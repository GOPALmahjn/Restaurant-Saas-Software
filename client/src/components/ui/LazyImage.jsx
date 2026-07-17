import { useState } from 'react';

/**
 * Image with native lazy-loading, async decode, and a shimmer placeholder that
 * cross-fades out once the bitmap is ready.
 *
 * The fade is a CSS transition rather than a JS animation: the image must never
 * be left stranded at opacity 0 if an animation frame is missed.
 */
const LazyImage = ({ src, alt, className = '', wrapperClassName = '', ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {!loaded && !failed && (
        <div className="shimmer absolute inset-0 z-10" aria-hidden="true" />
      )}

      {failed ? (
        <div
          className="flex h-full w-full items-center justify-center bg-white/5 text-3xl"
          aria-hidden="true"
        >
          🍽️
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`transition-opacity duration-700 ease-out ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
