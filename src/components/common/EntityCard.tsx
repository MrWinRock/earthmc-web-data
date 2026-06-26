import type { ReactNode } from "react";
import { Card } from "../ui";
import "./EntityCard.css";

interface EntityCardProps {
  onClick: () => void;
  title: ReactNode;
  badges?: ReactNode;
  meta?: ReactNode;
  footer?: ReactNode;
  accentColor?: string;
}

export function EntityCard({
  onClick,
  title,
  badges,
  meta,
  footer,
  accentColor,
}: EntityCardProps) {
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };
  return (
    <Card
      interactive
      className="entity-card"
      onClick={onClick}
      onKeyDown={handleKey}
      role="button"
      tabIndex={0}
    >
      {accentColor && (
        <span className="entity-card__swatch" style={{ background: accentColor }} />
      )}
      <div className="entity-card__head">
        <span className="entity-card__title">{title}</span>
        {badges && <span className="entity-card__badges">{badges}</span>}
      </div>
      {meta && <div className="entity-card__meta">{meta}</div>}
      {footer && <div className="entity-card__footer">{footer}</div>}
    </Card>
  );
}
