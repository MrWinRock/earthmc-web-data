import "./PermsView.css";

interface PermFlags {
  pvp: boolean;
  explosion: boolean;
  fire: boolean;
  mobs: boolean;
}

interface Perms {
  build: boolean[];
  destroy: boolean[];
  switch: boolean[];
  itemUse: boolean[];
  flags: PermFlags;
}

// Towny permission columns, in array order.
const COLUMNS = ["Resident", "Nation", "Ally", "Outsider"];
const ROWS: { key: keyof Omit<Perms, "flags">; label: string }[] = [
  { key: "build", label: "Build" },
  { key: "destroy", label: "Destroy" },
  { key: "switch", label: "Switch" },
  { key: "itemUse", label: "Item" },
];

export function PermsView({ perms }: { perms: Perms | undefined }) {
  if (!perms) return null;
  return (
    <div className="perms">
      <table className="perms__table">
        <thead>
          <tr>
            <th aria-hidden />
            {COLUMNS.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.key}>
              <th scope="row">{row.label}</th>
              {COLUMNS.map((_, i) => {
                const allowed = perms[row.key]?.[i] ?? false;
                return (
                  <td key={i}>
                    <span
                      className={`perms__cell ${
                        allowed ? "is-on" : "is-off"
                      }`}
                      title={allowed ? "Allowed" : "Denied"}
                    >
                      {allowed ? "✓" : "·"}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="perms__flags chip-row">
        {(Object.keys(perms.flags) as (keyof PermFlags)[]).map((flag) => (
          <span
            key={flag}
            className={`badge ${perms.flags[flag] ? "badge--green" : ""}`}
          >
            {flag} {perms.flags[flag] ? "on" : "off"}
          </span>
        ))}
      </div>
    </div>
  );
}
