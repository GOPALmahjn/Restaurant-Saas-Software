/** Shimmer block. Compose these to mirror the real layout while data loads. */
export const Skeleton = ({ className = '' }) => (
  <div className={`shimmer rounded-2xl bg-white/5 ${className}`} aria-hidden="true" />
);

/** Placeholder matching MenuCard's silhouette to avoid layout shift. */
export const MenuCardSkeleton = () => (
  <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
    <Skeleton className="h-52 w-full rounded-none" />
    <div className="space-y-4 p-5">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  </div>
);

export default Skeleton;
