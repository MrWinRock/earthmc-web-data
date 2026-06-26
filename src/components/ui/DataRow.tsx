import type { ReactNode } from "react";

interface DataRowProps {
  label: ReactNode;
  children: ReactNode;
  mono?: boolean;
}

/** A label/value row. Renders nothing when the value is null/undefined/empty. */
export function DataRow({ label, children, mono = false }: DataRowProps) {
  if (children === null || children === undefined || children === "") return null;
  return (
    <div className="datarow">
      <span className="datarow__label">{label}</span>
      <span className={`datarow__value${mono ? " mono" : ""}`}>{children}</span>
    </div>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <h3 className="section-title">{title}</h3>
      {children}
    </>
  );
}
