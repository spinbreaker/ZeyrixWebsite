type ImageSkeletonProps = {
  className?: string;
};

export function ImageSkeleton({ className = "" }: ImageSkeletonProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-xl
        bg-gray-200 dark:bg-zinc-900
        ${className}
      `}
    >
      <div
        className="
          absolute inset-0
          animate-shimmer
          bg-linear-to-r
          from-transparent
          via-white/40
          to-transparent
          dark:via-white/20
        "
      />
    </div>
  );
}