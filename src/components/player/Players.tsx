import { Link } from "react-router-dom";
import { api } from "../../api";
import type { PlayerBasic, PlayerDetailed } from "../../interfaces/player";
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
import { formatGold } from "../../utils/format";
import PlayerModal from "./PlayerModal";
import "./Players.css";

const Players = () => {
  const b = useEntityBrowser<PlayerBasic, PlayerDetailed>({
    list: api.listPlayers,
    query: api.queryPlayers,
    nameOf: (p) => p.name,
    pageSize: 24,
    lazyList: true,
  });

  return (
    <div className="page">
      <div className="page-head">
        <h1 className="page-title">
          <span className="accent">Players</span>
        </h1>
        <p className="page-sub">
          Search any of EarthMC’s residents by name, UUID or Discord ID. The full
          registry holds tens of thousands of players, so it only loads on
          request.
        </p>
      </div>

      <div className="toolbar">
        <SearchInput
          value={b.searchInput}
          onChange={b.setSearchInput}
          onSubmit={b.runSearch}
          placeholder="Player name, UUID or Discord ID…"
          ariaLabel="Search players"
        />
        <Button variant="primary" onClick={b.runSearch} disabled={b.searchLoading}>
          {b.searchLoading ? <Spinner /> : "Search"}
        </Button>
        {b.results && (
          <Button variant="ghost" onClick={b.clearSearch}>
            Clear
          </Button>
        )}
      </div>

      {/* ---- Search results ---- */}
      {b.searchLoading && (
        <Card>
          <div style={{ textAlign: "center", padding: "1rem" }}>
            <Spinner label="Searching…" />
          </div>
        </Card>
      )}

      {b.searchError && !b.searchLoading && (
        <Card>
          <ErrorState message={b.searchError.message} />
        </Card>
      )}

      {b.results && !b.searchLoading && (
        <>
          {b.results.length === 0 ? (
            <Card>
              <EmptyState
                icon="🔍"
                title="No player found"
                message={`Nothing matched “${b.searchInput}”.`}
              />
            </Card>
          ) : (
            <div className="card-grid card-grid--wide">
              {b.results.map((player) => (
                <Card
                  key={player.uuid}
                  interactive
                  className="player-card"
                  onClick={() => b.openWith(player)}
                >
                  <PlayerHead id={player.uuid} size={48} alt={player.name} />
                  <div className="player-card__body">
                    <div className="player-card__name">
                      {player.name}
                      {player.status.isOnline && (
                        <Badge tone="green" dot>
                          Online
                        </Badge>
                      )}
                    </div>
                    <div className="player-card__meta">
                      {player.town.name ? (
                        <Link
                          to={`/towns?search=${encodeURIComponent(player.town.name)}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {player.town.name}
                        </Link>
                      ) : (
                        "Nomad"
                      )}
                      {player.nation.name && (
                        <>
                          {" · "}
                          <Link
                            to={`/nations?search=${encodeURIComponent(player.nation.name)}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {player.nation.name}
                          </Link>
                        </>
                      )}
                    </div>
                    <div className="player-card__meta mono">
                      {formatGold(player.stats.balance)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* ---- Default: browse affordances ---- */}
      {!b.results && !b.searchLoading && (
        <>
          {!b.listRequested && (
            <Card className="browse-card">
              <EmptyState
                icon="🧭"
                title="Find a player"
                message="Search above, jump to who’s online, or load the full registry."
              >
                <div
                  className="chip-row"
                  style={{ justifyContent: "center", marginTop: "1rem" }}
                >
                  <Link className="btn btn--ghost" to="/online">
                    View online players
                  </Link>
                  <Button variant="primary" onClick={b.loadList}>
                    Load full registry
                  </Button>
                </div>
              </EmptyState>
            </Card>
          )}

          {b.listRequested && (
            <>
              <div className="toolbar toolbar--between">
                <SearchInput
                  value={b.filter}
                  onChange={b.setFilter}
                  placeholder="Filter loaded players by name…"
                  ariaLabel="Filter players"
                />
                <span className="pager__info">
                  {b.filteredCount.toLocaleString()} of{" "}
                  {b.totalCount.toLocaleString()} players
                </span>
              </div>

              {b.listLoading && <SkeletonCards count={12} />}
              {b.listError && !b.listLoading && (
                <Card>
                  <ErrorState message={b.listError.message} onRetry={b.reloadList} />
                </Card>
              )}

              {!b.listLoading && !b.listError && (
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
                          <div className="player-card__meta uuid">
                            {player.uuid}
                          </div>
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

export default Players;
