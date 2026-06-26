import type { TownDetailed, TownResident } from "../../interfaces/town";
import { Badge, BoolBadge, DataRow, Modal, Section } from "../ui";
import { PermsView } from "../common/PermsView";
import {
  formatDate,
  formatGold,
  formatNumber,
  mapUrl,
} from "../../utils/format";

interface TownModalProps {
  town: TownDetailed | null;
  isOpen: boolean;
  onClose: () => void;
}

const ResidentChips = ({
  title,
  residents,
}: {
  title: string;
  residents: TownResident[] | undefined;
}) => {
  if (!residents || residents.length === 0) return null;
  return (
    <Section title={`${title} (${residents.length})`}>
      <div className="chip-row">
        {residents.map((r) => (
          <span key={r.uuid} className="badge">
            {r.name}
          </span>
        ))}
      </div>
    </Section>
  );
};

const TownModal = ({ town, isOpen, onClose }: TownModalProps) => {
  if (!isOpen || !town) return null;

  const map = mapUrl({
    world: town.coordinates.spawn.world,
    x: town.coordinates.spawn.x,
    y: town.coordinates.spawn.y,
    z: town.coordinates.spawn.z,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={town.name}
      headerExtra={
        <a className="btn btn--ghost btn--sm" href={map} target="_blank" rel="noopener noreferrer">
          🗺 Map
        </a>
      }
    >
      <div className="chip-row" style={{ marginBottom: "0.5rem" }}>
        {town.status.isCapital && <Badge tone="amber">Capital</Badge>}
        {town.status.isRuined && <Badge tone="red">Ruined</Badge>}
        {town.status.isForSale && (
          <Badge tone="amber">For sale · {formatGold(town.stats.forSalePrice)}</Badge>
        )}
        {town.status.isPublic && <Badge tone="green">Public</Badge>}
        {town.status.isOpen && <Badge tone="green">Open</Badge>}
        {town.status.isNeutral && <Badge tone="info">Neutral</Badge>}
      </div>

      <div className="datalist">
        <DataRow label="UUID" mono>
          {town.uuid}
        </DataRow>
        {town.board && <DataRow label="Board">{town.board}</DataRow>}
        <DataRow label="Mayor">{town.mayor.name}</DataRow>
        <DataRow label="Nation">{town.nation.name || "—"}</DataRow>
        <DataRow label="Founder">{town.founder}</DataRow>
        {town.wiki && (
          <DataRow label="Wiki">
            <a href={town.wiki} target="_blank" rel="noopener noreferrer">
              {town.wiki}
            </a>
          </DataRow>
        )}
      </div>

      <Section title="Stats">
        <div className="datalist">
          <DataRow label="Residents">{formatNumber(town.stats.numResidents)}</DataRow>
          <DataRow label="Town blocks">
            {formatNumber(town.stats.numTownBlocks)} / {formatNumber(town.stats.maxTownBlocks)}
          </DataRow>
          <DataRow label="Trusted">{formatNumber(town.stats.numTrusted)}</DataRow>
          <DataRow label="Outlaws">{formatNumber(town.stats.numOutlaws)}</DataRow>
          <DataRow label="Balance">{formatGold(town.stats.balance)}</DataRow>
        </div>
      </Section>

      <Section title="Location">
        <div className="datalist">
          <DataRow label="Spawn" mono>
            {town.coordinates.spawn.x.toFixed(0)}, {town.coordinates.spawn.y.toFixed(0)},{" "}
            {town.coordinates.spawn.z.toFixed(0)}
          </DataRow>
          <DataRow label="Home block" mono>
            {town.coordinates.homeBlock[0]}, {town.coordinates.homeBlock[1]}
          </DataRow>
        </div>
      </Section>

      <Section title="Timestamps">
        <div className="datalist">
          <DataRow label="Registered">{formatDate(town.timestamps.registered)}</DataRow>
          <DataRow label="Joined nation">
            {formatDate(town.timestamps.joinedNationAt)}
          </DataRow>
          {town.timestamps.ruinedAt && (
            <DataRow label="Ruined">{formatDate(town.timestamps.ruinedAt)}</DataRow>
          )}
        </div>
      </Section>

      <Section title="Status flags">
        <div className="datalist">
          <DataRow label="Overclaimed">
            <BoolBadge value={town.status.isOverClaimed} />
          </DataRow>
          <DataRow label="Overclaim shield">
            <BoolBadge value={town.status.hasOverclaimShield} />
          </DataRow>
          <DataRow label="Outsiders spawn">
            <BoolBadge value={town.status.canOutsidersSpawn} />
          </DataRow>
        </div>
      </Section>

      <ResidentChips title="Residents" residents={town.residents} />
      <ResidentChips title="Trusted" residents={town.trusted} />
      <ResidentChips title="Outlaws" residents={town.outlaws} />

      <Section title="Permissions">
        <PermsView perms={town.perms} />
      </Section>

      <details>
        <summary>Developer · raw JSON</summary>
        <pre>{JSON.stringify(town, null, 2)}</pre>
      </details>
    </Modal>
  );
};

export default TownModal;
