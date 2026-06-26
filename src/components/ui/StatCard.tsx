import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  sub?: ReactNode;
}

export function StatCard({ label, value, icon, sub }: StatCardProps) {
  return (
    <div className="stat">
      <div className="stat__top">
        <span>{label}</span>
        {icon && <span aria-hidden>{icon}</span>}
      </div>
      <div className="stat__value">{value}</div>
      {sub && <div className="stat__sub">{sub}</div>}
    </div>
  );
}
