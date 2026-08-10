type TextSkeletonProps = {
  lines?: number;
};

export function TextSkeleton({ lines = 3 }: TextSkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`
            relative h-4 overflow-hidden rounded
            bg-gray-200 dark:bg-gray-800
            ${i === lines - 1 ? "w-2/3" : "w-full"}
          `}
        >
          <div
            className="
              absolute inset-0
              -translate-x-full
              animate-[shimmer_1.6s_infinite]
              bg-linear-to-r
              from-transparent
              via-white/40
              to-transparent
            "
          />
        </div>
      ))}
    </div>
  );
}
