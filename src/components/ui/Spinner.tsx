export function Spinner({ label }: { label?: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
      <span className="spinner" aria-hidden />
      {label && <span style={{ color: "var(--text-muted)" }}>{label}</span>}
    </span>
  );
}
