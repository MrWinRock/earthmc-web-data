import { api } from "../../api";
import type { OnlinePlayer } from "../../interfaces/online";
import type { PlayerDetailed } from "../../interfaces/player";
import { useEntityBrowser } from "../../hooks/useEntityBrowser";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Pagination,
  PlayerHead,
  SearchInput,
  SkeletonCards,
  Spinner,
} from "../ui";
import PlayerModal from "../player/PlayerModal";
import "../player/Players.css";

const Online = () => {
  const b = useEntityBrowser<OnlinePlayer, PlayerDetailed>({
    list: (signal) => api.online(signal).then((r) => r.players),
    query: api.queryPlayers,
    nameOf: (p) => p.name,
    pageSize: 48,
  });

  return (
    <div className="page">
      <div className="page-head">
        <h1 className="page-title">
          Players <span className="accent">Online</span>
        </h1>
        <p className="page-sub">
          Everyone connected to EarthMC right now. Click a head to inspect a
          player.
        </p>
      </div>

      <div className="toolbar toolbar--between">
        <SearchInput
          value={b.filter}
          onChange={b.setFilter}
          placeholder="Filter online players…"
          ariaLabel="Filter online players"
        />
        <div className="chip-row" style={{ alignItems: "center" }}>
          {!b.listLoading && !b.listError && (
            <Badge tone="green" dot pulse>
              {b.totalCount.toLocaleString()} online
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={b.reloadList}>
            ↻ Refresh
          </Button>
        </div>
      </div>

      {b.listLoading && <SkeletonCards count={12} />}

      {b.listError && !b.listLoading && (
        <Card>
          <ErrorState message={b.listError.message} onRetry={b.reloadList} />
        </Card>
      )}

      {!b.listLoading && !b.listError && (
        <>
          {b.filteredCount === 0 ? (
            <Card>
              <EmptyState
                icon="🌙"
                title="Nobody matches"
                message={
                  b.filter
                    ? `No online player matches “${b.filter}”.`
                    : "No players are online right now."
                }
              />
            </Card>
          ) : (
            <>
              <div className="card-grid">
                {b.pageItems.map((player) => (
                  <Card
                    key={player.uuid}
                    interactive
                    className="player-card"
                    onClick={() => b.openDetail(player.uuid)}
                  >
                    <PlayerHead id={player.uuid} size={40} alt={player.name} />
                    <div className="player-card__body">
                      <div className="player-card__name">{player.name}</div>
                      <div className="player-card__meta uuid">{player.uuid}</div>
                    </div>
                  </Card>
                ))}
              </div>
              <Pagination
                page={b.page}
                totalPages={b.totalPages}
                onChange={b.setPage}
              />
            </>
          )}
        </>
      )}

      {b.modalLoading && (
        <div className="modal-overlay">
          <div className="card card--pad">
            <Spinner label="Loading player…" />
          </div>
        </div>
      )}
      {b.modalError && (
        <Card style={{ marginTop: "1rem" }}>
          <ErrorState message={b.modalError.message} />
        </Card>
      )}
      <PlayerModal
        isOpen={!!b.entity && !b.modalLoading}
        player={b.entity}
        onClose={b.closeModal}
      />
    </div>
  );
};

export default Online;
