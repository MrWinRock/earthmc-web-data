import type { NationDetailed } from "../../interfaces/nation";
import { Badge, DataRow, Modal, Section } from "../ui";
import { formatDate, formatGold, formatNumber, mapUrl } from "../../utils/format";

interface NationModalProps {
  nation: NationDetailed | null;
  isOpen: boolean;
  onClose: () => void;
}

const Chips = ({
  title,
  items,
}: {
  title: string;
  items: { name: string; uuid: string }[] | undefined;
}) => {
  if (!items || items.length === 0) return null;
  return (
    <Section title={`${title} (${items.length})`}>
      <div className="chip-row">
        {items.map((i) => (
          <span key={i.uuid} className="badge">
            {i.name}
          </span>
        ))}
      </div>
    </Section>
  );
};

const NationModal = ({ nation, isOpen, onClose }: NationModalProps) => {
  if (!isOpen || !nation) return null;

  const map = mapUrl({
    world: nation.coordinates.spawn.world,
    x: nation.coordinates.spawn.x,
    y: nation.coordinates.spawn.y,
    z: nation.coordinates.spawn.z,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          {nation.dynmapColour && (
            <span
              className="entity-card__swatch"
              style={{
                position: "static",
                width: 14,
                height: 14,
                borderRadius: 4,
                background: nation.dynmapColour,
              }}
            />
          )}
          {nation.name}
        </span>
      }
      headerExtra={
        <a className="btn btn--ghost btn--sm" href={map} target="_blank" rel="noopener noreferrer">
          🗺 Map
        </a>
      }
    >
      <div className="chip-row" style={{ marginBottom: "0.5rem" }}>
        {nation.status.isPublic && <Badge tone="green">Public</Badge>}
        {nation.status.isOpen && <Badge tone="green">Open</Badge>}
        {nation.status.isNeutral && <Badge tone="info">Neutral</Badge>}
      </div>

      <div className="datalist">
        <DataRow label="UUID" mono>
          {nation.uuid}
        </DataRow>
        {nation.board && <DataRow label="Board">{nation.board}</DataRow>}
        <DataRow label="King">{nation.king.name}</DataRow>
        <DataRow label="Capital">{nation.capital.name}</DataRow>
        {nation.wiki && (
          <DataRow label="Wiki">
            <a href={nation.wiki} target="_blank" rel="noopener noreferrer">
              {nation.wiki}
            </a>
          </DataRow>
        )}
        <DataRow label="Registered">{formatDate(nation.timestamps.registered)}</DataRow>
      </div>

      <Section title="Stats">
        <div className="datalist">
          <DataRow label="Towns">{formatNumber(nation.stats.numTowns)}</DataRow>
          <DataRow label="Residents">{formatNumber(nation.stats.numResidents)}</DataRow>
          <DataRow label="Town blocks">{formatNumber(nation.stats.numTownBlocks)}</DataRow>
          <DataRow label="Allies">{formatNumber(nation.stats.numAllies)}</DataRow>
          <DataRow label="Enemies">{formatNumber(nation.stats.numEnemies)}</DataRow>
          <DataRow label="Balance">{formatGold(nation.stats.balance)}</DataRow>
        </div>
      </Section>

      <Chips title="Towns" items={nation.towns} />
      <Chips title="Allies" items={nation.allies} />
      <Chips title="Enemies" items={nation.enemies} />
      <Chips title="Sanctioned" items={nation.sanctioned} />

      <details>
        <summary>Developer · raw JSON</summary>
        <pre>{JSON.stringify(nation, null, 2)}</pre>
      </details>
    </Modal>
  );
};

export default NationModal;
