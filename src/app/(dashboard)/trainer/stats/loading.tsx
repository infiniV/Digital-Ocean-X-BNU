export default function LoadingStats() {
  return (
    <main className="min-h-screen space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-notion-gray-light/20 dark:bg-notion-gray-dark/30" />
        <div className="h-6 w-96 animate-pulse rounded-lg bg-notion-gray-light/20 dark:bg-notion-gray-dark/30" />
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50"
          >
            <div className="mb-4 h-12 w-12 animate-pulse rounded-lg bg-notion-gray-light/20 dark:bg-notion-gray-dark/30" />
            <div className="mb-2 h-5 w-24 animate-pulse rounded-lg bg-notion-gray-light/20 dark:bg-notion-gray-dark/30" />
            <div className="h-9 w-16 animate-pulse rounded-lg bg-notion-gray-light/20 dark:bg-notion-gray-dark/30" />
            <div className="mt-2 flex items-center gap-2">
              <div className="h-6 w-24 animate-pulse rounded-full bg-notion-gray-light/20 dark:bg-notion-gray-dark/30" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-notion-gray-light/20 dark:bg-notion-gray-dark/30" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart Loading Skeleton */}
      <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
        <div className="mb-6 h-7 w-48 animate-pulse rounded-lg bg-notion-gray-light/20 dark:bg-notion-gray-dark/30" />
        <div className="h-[300px] w-full animate-pulse rounded-lg bg-notion-gray-light/20 dark:bg-notion-gray-dark/30" />
      </div>

      {/* Detailed Stats Loading Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="h-7 w-36 animate-pulse rounded-lg bg-notion-gray-light/20 dark:bg-notion-gray-dark/30" />
              <div className="h-5 w-5 animate-pulse rounded-lg bg-notion-gray-light/20 dark:bg-notion-gray-dark/30" />
            </div>
            <div className="mb-2 h-9 w-20 animate-pulse rounded-lg bg-notion-gray-light/20 dark:bg-notion-gray-dark/30" />
            <div className="mt-2 space-y-2">
              <div className="h-5 w-48 animate-pulse rounded-lg bg-notion-gray-light/20 dark:bg-notion-gray-dark/30" />
              <div className="h-5 w-40 animate-pulse rounded-lg bg-notion-gray-light/20 dark:bg-notion-gray-dark/30" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}