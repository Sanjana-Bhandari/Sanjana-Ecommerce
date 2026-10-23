// Grey shimmering placeholders shown while products load.
export function ProductSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[4/5] animate-shimmer" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-3 w-1/3 animate-shimmer rounded" />
        <div className="skeleton h-4 w-3/4 animate-shimmer rounded" />
        <div className="skeleton h-9 w-full animate-shimmer rounded-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
