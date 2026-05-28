export function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
      <SkeletonBox className="h-4 w-3/4" />
      <SkeletonBox className="h-3 w-1/2" />
      <SkeletonBox className="h-3 w-2/5 mt-1" />
      <div className="mt-2 space-y-2">
        <SkeletonBox className="h-3 w-full" />
        <SkeletonBox className="h-3 w-4/5" />
        <SkeletonBox className="h-3 w-3/5" />
        <SkeletonBox className="h-3 w-2/3" />
      </div>
      <SkeletonBox className="h-10 w-full mt-3 rounded" />
    </div>
  );
}

export function JobDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Title */}
      <SkeletonBox className="h-8 w-2/3 mb-2" />
      <SkeletonBox className="h-4 w-1/3 mb-5" />

      {/* Info grid */}
      <div className="border border-gray-200 rounded-lg bg-white p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start gap-2">
            <SkeletonBox className="w-4 h-4 shrink-0 mt-0.5 rounded-full" />
            <div className="flex-1 space-y-1">
              <SkeletonBox className="h-2.5 w-12" />
              <SkeletonBox className="h-3.5 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Qualification bar */}
      <SkeletonBox className="h-10 w-full rounded-lg mb-5" />

      {/* Sections */}
      {[80, 60, 70, 50].map((w, i) => (
        <div key={i} className="mt-5">
          <SkeletonBox className="h-5 w-48 mb-3" />
          <div className="space-y-2">
            <SkeletonBox className={`h-3 w-full`} />
            <SkeletonBox className={`h-3 w-[${w}%]`} />
            <SkeletonBox className="h-3 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatCircleSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 w-[72px] sm:w-auto">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#243560] animate-pulse border-4 border-white/30" />
      <SkeletonBox className="h-3 w-14 bg-gray-600/40" />
    </div>
  );
}
