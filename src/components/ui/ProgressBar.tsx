interface ProgressBarProps {
  value: number;
  max: number;
  tone?: "green" | "amber";
}

export function ProgressBar({ value, max, tone = "green" }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={`progress__bar${tone === "amber" ? " progress__bar--amber" : ""}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
