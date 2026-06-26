interface SkeletonProps {
  width?: string;
  height?: string;
  radius?: string;
  className?: string;
}

export function Skeleton({
  width = "100%",
  height = "1rem",
  radius,
  className = "",
}: SkeletonProps) {
  return (
    <span
      className={`skeleton ${className}`.trim()}
      style={{
        display: "block",
        width,
        height,
        borderRadius: radius,
      }}
      aria-hidden
    />
  );
}

/** A grid of skeleton cards for list loading states. */
export function SkeletonCards({ count = 8 }: { count?: number }) {
  return (
    <div className="card-grid" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div
          className="card card--pad"
          key={i}
          style={{ display: "grid", gap: "0.6rem" }}
        >
          <Skeleton width="60%" height="1.1rem" />
          <Skeleton width="90%" height="0.8rem" />
          <Skeleton width="40%" height="0.8rem" />
        </div>
      ))}
    </div>
  );
}
