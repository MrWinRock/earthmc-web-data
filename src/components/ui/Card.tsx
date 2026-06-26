import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  pad?: boolean;
  children: ReactNode;
}

export function Card({
  interactive = false,
  pad = true,
  className = "",
  children,
  ...rest
}: CardProps) {
  const classes = [
    "card",
    pad ? "card--pad" : "",
    interactive ? "card--interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
