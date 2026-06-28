import { Link } from "react-router-dom";
import type { PlayerDetailed } from "../../interfaces/player";
import { Badge, BoolBadge, DataRow, Modal, PlayerHead, Section } from "../ui";
import { PermsView } from "../common/PermsView";
import { formatDate, formatGold, formatRelative } from "../../utils/format";

interface PlayerModalProps {
  player: PlayerDetailed | null;
  isOpen: boolean;
  onClose: () => void;
}

const PlayerModal = ({ player, isOpen, onClose }: PlayerModalProps) => {
  if (!isOpen || !player) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <PlayerHead id={player.uuid} size={40} alt={player.name} />
          <span>
            {player.name}
            {player.formattedName && player.formattedName !== player.name && (
              <span
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  fontWeight: 400,
                }}
              >
                {player.formattedName}
              </span>
            )}
          </span>
        </span>
      }
      headerExtra={
        <Badge tone={player.status.isOnline ? "green" : "muted"} dot>
          {player.status.isOnline ? "Online" : "Offline"}
        </Badge>
      }
    >
      <div className="chip-row" style={{ marginBottom: "0.5rem" }}>
        {player.status.isMayor && <Badge tone="amber">Mayor</Badge>}
        {player.status.isKing && <Badge tone="amber">King</Badge>}
        {player.status.isNPC && <Badge>NPC</Badge>}
        {player.title && <Badge tone="info">{player.title}</Badge>}
      </div>

      <div className="datalist">
        <DataRow label="UUID" mono>
          {player.uuid}
        </DataRow>
        {player.surname && <DataRow label="Surname">{player.surname}</DataRow>}
        {player.about && <DataRow label="About">{player.about}</DataRow>}
        {player.discord && (
          <DataRow label="Discord" mono>
            {player.discord}
          </DataRow>
        )}
      </div>

      <Section title="Affiliation">
        <div className="datalist">
          <DataRow label="Town">
            {player.town.name ? (
              <Link to={`/towns?search=${encodeURIComponent(player.town.name)}`} onClick={onClose}>
                {player.town.name}
              </Link>
            ) : (
              "—"
            )}
          </DataRow>
          <DataRow label="Nation">
            {player.nation.name ? (
              <Link to={`/nations?search=${encodeURIComponent(player.nation.name)}`} onClick={onClose}>
                {player.nation.name}
              </Link>
            ) : (
              "—"
            )}
          </DataRow>
          {player.ranks.townRanks.length > 0 && (
            <DataRow label="Town ranks">
              {player.ranks.townRanks.join(", ")}
            </DataRow>
          )}
          {player.ranks.nationRanks.length > 0 && (
            <DataRow label="Nation ranks">
              {player.ranks.nationRanks.join(", ")}
            </DataRow>
          )}
        </div>
      </Section>

      <Section title="Stats">
        <div className="datalist">
          <DataRow label="Balance">{formatGold(player.stats.balance)}</DataRow>
          <DataRow label="Friends">{player.stats.numFriends}</DataRow>
        </div>
      </Section>

      <Section title="Timestamps">
        <div className="datalist">
          <DataRow label="Registered">
            {formatDate(player.timestamps.registered)}
          </DataRow>
          <DataRow label="Joined town">
            {formatDate(player.timestamps.joinedTownAt)}
          </DataRow>
          <DataRow label="Last online">
            {player.timestamps.lastOnline
              ? `${formatDate(player.timestamps.lastOnline)} (${formatRelative(
                  player.timestamps.lastOnline
                )})`
              : "N/A"}
          </DataRow>
        </div>
      </Section>

      <Section title="Status flags">
        <div className="datalist">
          <DataRow label="Has town">
            <BoolBadge value={player.status.hasTown} />
          </DataRow>
          <DataRow label="Has nation">
            <BoolBadge value={player.status.hasNation} />
          </DataRow>
        </div>
      </Section>

      {player.friends.length > 0 && (
        <Section title={`Friends (${player.friends.length})`}>
          <div className="chip-row">
            {player.friends.map((f) => (
              <span key={f.uuid} className="badge">
                {f.name}
              </span>
            ))}
          </div>
        </Section>
      )}

      <Section title="Permissions">
        <PermsView perms={player.perms} />
      </Section>

      <details>
        <summary>Developer · raw JSON</summary>
        <pre>{JSON.stringify(player, null, 2)}</pre>
      </details>
    </Modal>
  );
};

export default PlayerModal;
