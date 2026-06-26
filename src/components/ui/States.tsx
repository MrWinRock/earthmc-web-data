import type { ReactNode } from "react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: ReactNode;
  children?: ReactNode;
}

export function EmptyState({
  icon = "🗺️",
  title,
  message,
  children,
}: EmptyStateProps) {
  return (
    <div className="state">
      <div className="state__icon" aria-hidden>
        {icon}
      </div>
      <p className="state__title">{title}</p>
      {message && <p className="state__msg">{message}</p>}
      {children}
    </div>
  );
}

interface ErrorStateProps {
  message?: ReactNode;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="state state--error">
      <div className="state__icon" aria-hidden>
        ⚠️
      </div>
      <p className="state__title">Couldn’t load data</p>
      <p className="state__msg">
        {message ?? "The EarthMC API request failed."}
      </p>
      {onRetry && (
        <div style={{ marginTop: "1rem" }}>
          <Button variant="ghost" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
