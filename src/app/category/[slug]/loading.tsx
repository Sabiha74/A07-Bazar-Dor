
export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f1f6f2]">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:px-6">

        {/* Category Header Skeleton */}
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-4">
          <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200" />

          <div className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-40 animate-pulse rounded bg-gray-100" />
          </div>
        </div>

        {/* Sorting Skeleton */}
        <div className="flex justify-end rounded-xl border border-gray-200 bg-white px-4 py-3">
          <div className="h-8 w-28 animate-pulse rounded-lg bg-gray-200" />
        </div>

        {/* Product Count Skeleton */}
        <div className="h-3 w-36 animate-pulse rounded bg-gray-200" />

        {/* Product Cards Skeleton */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl border border-gray-200 bg-white"
            />
          ))}
        </div>

      </div>
    </main>
  );
}
