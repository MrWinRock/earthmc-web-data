import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "default" | "primary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md";
  children: ReactNode;
}

const variantClass: Record<Variant, string> = {
  default: "",
  primary: "btn--primary",
  ghost: "btn--ghost",
  danger: "btn--danger",
};

export function Button({
  variant = "default",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    "btn",
    variantClass[variant],
    size === "sm" ? "btn--sm" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
