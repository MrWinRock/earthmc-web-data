import { api } from "../../api";
import { useFetch } from "../../hooks/useFetch";
import {
  Badge,
  Button,
  Card,
  ErrorState,
  ProgressBar,
  Skeleton,
  StatCard,
} from "../ui";
import {
  formatMcClock,
  formatNumber,
  getMoonPhaseEmoji,
  titleCase,
} from "../../utils/format";
import "./Home.css";

const Home = () => {
  const { data, loading, error, reload } = useFetch((signal) =>
    api.serverStatus(signal)
  );

  return (
    <div className="page">
      <div className="page-head">
        <h1 className="page-title">
          EarthMC <span className="accent">Server Status</span>
        </h1>
        <p className="page-sub">
          Live snapshot of the Aurora map — players, towns, nations and world
          state, straight from the official v4 API.
        </p>
      </div>

      {error && !loading && (
        <Card>
          <ErrorState message={error.message} onRetry={reload} />
        </Card>
      )}

      {loading && (
        <div className="card-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div className="stat" key={i}>
              <Skeleton width="40%" height="0.8rem" />
              <Skeleton width="60%" height="1.8rem" />
            </div>
          ))}
        </div>
      )}

      {data && !loading && (
        <>
          {/* ---- Hero / world state ---- */}
          <Card className="hero">
            <div className="hero__main">
              <div className="hero__online">
                <span className="hero__online-value">
                  {formatNumber(data.stats.numOnlinePlayers)}
                  <span className="hero__online-max">
                    {" "}
                    / {formatNumber(data.stats.maxPlayers)}
                  </span>
                </span>
                <span className="hero__online-label">players online</span>
                <ProgressBar
                  value={data.stats.numOnlinePlayers}
                  max={data.stats.maxPlayers}
                />
              </div>
              <div className="hero__badges">
                <Badge tone="info">
                  {getMoonPhaseEmoji(data.moonPhase)} {titleCase(data.moonPhase)}
                </Badge>
                <Badge tone={data.status.hasStorm ? "amber" : "muted"}>
                  {data.status.hasStorm ? "⛈ Storm" : "☀ Clear"}
                </Badge>
                {data.status.isThundering && <Badge tone="amber">⚡ Thunder</Badge>}
                <Badge tone="green" dot pulse>
                  v{data.version}
                </Badge>
              </div>
            </div>
            <div className="hero__time">
              <span className="hero__time-clock">
                {formatMcClock(data.timestamps.serverTimeOfDay)}
              </span>
              <span className="hero__time-label">in-game time</span>
            </div>
          </Card>

          {/* ---- Vote party ---- */}
          <Card className="voteparty">
            <div className="voteparty__head">
              <span>🎉 Vote Party</span>
              <span className="mono">
                {formatNumber(
                  data.voteParty.target - data.voteParty.numRemaining
                )}{" "}
                / {formatNumber(data.voteParty.target)}
              </span>
            </div>
            <ProgressBar
              tone="amber"
              value={data.voteParty.target - data.voteParty.numRemaining}
              max={data.voteParty.target}
            />
            <p className="voteparty__note">
              {formatNumber(data.voteParty.numRemaining)} votes until the next
              party.
            </p>
          </Card>

          {/* ---- Stat grid ---- */}
          <h2 className="section-title">World statistics</h2>
          <div className="card-grid">
            <StatCard
              label="Residents"
              value={formatNumber(data.stats.numResidents)}
              icon="🧑"
            />
            <StatCard
              label="Nomads"
              value={formatNumber(data.stats.numNomads)}
              icon="🧭"
              sub={`${formatNumber(data.stats.numOnlineNomads)} online`}
            />
            <StatCard
              label="Towns"
              value={formatNumber(data.stats.numTowns)}
              icon="🏘"
            />
            <StatCard
              label="Nations"
              value={formatNumber(data.stats.numNations)}
              icon="🚩"
            />
            <StatCard
              label="Town Blocks"
              value={formatNumber(data.stats.numTownBlocks)}
              icon="⬛"
            />
            <StatCard
              label="Quarters"
              value={formatNumber(data.stats.numQuarters)}
              icon="🏗"
            />
            <StatCard
              label="Cuboids"
              value={formatNumber(data.stats.numCuboids)}
              icon="📦"
            />
            <StatCard
              label="Full Time"
              value={formatNumber(data.stats.fullTime)}
              icon="⏱"
              sub="ticks"
            />
          </div>

          <div className="toolbar" style={{ marginTop: "1.5rem" }}>
            <Button variant="ghost" size="sm" onClick={reload}>
              ↻ Refresh
            </Button>
            <details className="raw-details">
              <summary>Developer · raw JSON</summary>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </details>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
