
export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f1f6f2]">
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">

        {/* Breadcrumb */}
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />

        {/* Product Summary */}
        <div className="flex h-32 animate-pulse items-center gap-4 rounded-xl bg-white p-5">
          <div className="h-16 w-16 rounded-xl bg-gray-200" />

          <div className="space-y-3">
            <div className="h-5 w-40 rounded bg-gray-200" />
            <div className="h-3 w-28 rounded bg-gray-100" />
            <div className="h-3 w-52 rounded bg-gray-100" />
          </div>
        </div>

        {/* Price Summary */}
        <div className="rounded-xl bg-white p-5">
          <div className="mb-5 h-5 w-40 animate-pulse rounded bg-gray-200" />

          <div className="grid gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        </div>

        {/* Market Table */}
        <div className="rounded-xl bg-white p-5">
          <div className="mb-5 h-5 w-48 animate-pulse rounded bg-gray-200" />

          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-9 animate-pulse rounded bg-gray-100"
              />
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
