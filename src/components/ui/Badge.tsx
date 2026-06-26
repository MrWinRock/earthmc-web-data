import type { ReactNode } from "react";

type Tone = "muted" | "green" | "amber" | "red" | "info";

interface BadgeProps {
  tone?: Tone;
  dot?: boolean;
  pulse?: boolean;
  children: ReactNode;
}

export function Badge({
  tone = "muted",
  dot = false,
  pulse = false,
  children,
}: BadgeProps) {
  const toneClass = tone === "muted" ? "" : `badge--${tone}`;
  return (
    <span className={["badge", toneClass].filter(Boolean).join(" ")}>
      {dot && (
        <span
          className={`badge__dot${pulse ? " badge__dot--pulse" : ""}`}
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}

/** Yes/No badge for boolean flags. */
export function BoolBadge({
  value,
  yes = "Yes",
  no = "No",
}: {
  value: boolean;
  yes?: string;
  no?: string;
}) {
  return <Badge tone={value ? "green" : "muted"}>{value ? yes : no}</Badge>;
}
