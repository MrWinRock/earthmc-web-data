import { Link } from "react-router-dom";
import type { QuarterDetailed } from "../../interfaces/quarter";
import { Badge, DataRow, Modal, Section } from "../ui";
import {
  formatDate,
  formatGold,
  mapUrl,
  rgbaToCss,
  titleCase,
} from "../../utils/format";

interface QuarterModalProps {
  quarter: QuarterDetailed | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuarterModal = ({ quarter, isOpen, onClose }: QuarterModalProps) => {
  if (!isOpen || !quarter) return null;

  const first = quarter.cuboids[0]?.cornerOne;
  const map = first
    ? mapUrl({ x: first[0], y: first[1], z: first[2] })
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: rgbaToCss(quarter.colour),
            }}
          />
          {quarter.name}
        </span>
      }
      headerExtra={
        map ? (
          <a className="btn btn--ghost btn--sm" href={map} target="_blank" rel="noopener noreferrer">
            🗺 Map
          </a>
        ) : undefined
      }
    >
      <div className="chip-row" style={{ marginBottom: "0.5rem" }}>
        <Badge tone="info">{titleCase(quarter.type)}</Badge>
        {quarter.status.isEmbassy && <Badge tone="amber">Embassy</Badge>}
        {quarter.status.isForSale && (
          <Badge tone="amber">For sale · {formatGold(quarter.stats.price)}</Badge>
        )}
      </div>

      <div className="datalist">
        <DataRow label="UUID" mono>
          {quarter.uuid}
        </DataRow>
        <DataRow label="Owner">
          {quarter.owner.name ? (
            <Link to={`/players?search=${encodeURIComponent(quarter.owner.name)}`} onClick={onClose}>
              {quarter.owner.name}
            </Link>
          ) : (
            "Unowned"
          )}
        </DataRow>
        <DataRow label="Town">
          {quarter.town.name ? (
            <Link to={`/towns?search=${encodeURIComponent(quarter.town.name)}`} onClick={onClose}>
              {quarter.town.name}
            </Link>
          ) : (
            "—"
          )}
        </DataRow>
        <DataRow label="Nation">
          {quarter.nation.name ? (
            <Link to={`/nations?search=${encodeURIComponent(quarter.nation.name)}`} onClick={onClose}>
              {quarter.nation.name}
            </Link>
          ) : (
            "—"
          )}
        </DataRow>
      </div>

      <Section title="Stats">
        <div className="datalist">
          <DataRow label="Volume">{quarter.stats.volume.toLocaleString()}</DataRow>
          <DataRow label="Cuboids">{quarter.stats.numCuboids}</DataRow>
          <DataRow label="Price">
            {quarter.stats.price === null ? "Not for sale" : formatGold(quarter.stats.price)}
          </DataRow>
        </div>
      </Section>

      <Section title="Timestamps">
        <div className="datalist">
          <DataRow label="Registered">{formatDate(quarter.timestamps.registered)}</DataRow>
          <DataRow label="Claimed">{formatDate(quarter.timestamps.claimedAt)}</DataRow>
        </div>
      </Section>

      {quarter.trusted.length > 0 && (
        <Section title={`Trusted (${quarter.trusted.length})`}>
          <div className="chip-row">
            {quarter.trusted.map((t) => (
              <Link
                key={t.uuid}
                className="badge"
                style={{ textDecoration: "none" }}
                to={`/players?search=${encodeURIComponent(t.name)}`}
                onClick={onClose}
              >
                {t.name}
              </Link>
            ))}
          </div>
        </Section>
      )}

      <Section title={`Cuboids (${quarter.cuboids.length})`}>
        <div className="datalist">
          {quarter.cuboids.map((c, i) => (
            <DataRow key={i} label={`#${i + 1}`} mono>
              [{c.cornerOne.join(", ")}] → [{c.cornerTwo.join(", ")}]
            </DataRow>
          ))}
        </div>
      </Section>

      <details>
        <summary>Developer · raw JSON</summary>
        <pre>{JSON.stringify(quarter, null, 2)}</pre>
      </details>
    </Modal>
  );
};

export default QuarterModal;
