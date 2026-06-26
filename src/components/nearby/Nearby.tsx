import { useState } from "react";
import type { FormEvent } from "react";
import { api, isCancel, toError } from "../../api";
import type {
  NearbyQuery,
  NearbyResult,
  LocationResult,
} from "../../interfaces/nearby";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Spinner,
} from "../ui";
import { mapUrl } from "../../utils/format";
import "./Nearby.css";

type Mode = "nearby" | "location";

const Nearby = () => {
  const [mode, setMode] = useState<Mode>("nearby");

  // Nearby state
  const [targetType, setTargetType] = useState<"TOWN" | "COORDINATE">("TOWN");
  const [townName, setTownName] = useState("");
  const [coords, setCoords] = useState<[number, number]>([0, 0]);
  const [radius, setRadius] = useState(100);
  const [nearbyResults, setNearbyResults] = useState<NearbyResult[] | null>(null);

  // Location state
  const [locCoords, setLocCoords] = useState<[number, number]>([0, 0]);
  const [location, setLocation] = useState<LocationResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const runNearby = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNearbyResults(null);
    const query: NearbyQuery = {
      target_type: targetType,
      target: targetType === "TOWN" ? townName.trim() : coords,
      search_type: "TOWN",
      radius,
    };
    try {
      const data = await api.nearby(query);
      setNearbyResults(data[0] ?? []);
    } catch (err) {
      if (!isCancel(err)) setError(toError(err));
    } finally {
      setLoading(false);
    }
  };

  const runLocation = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLocation(null);
    try {
      const data = await api.location(locCoords);
      setLocation(data[0] ?? null);
    } catch (err) {
      if (!isCancel(err)) setError(toError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-head">
        <h1 className="page-title">
          <span className="accent">Nearby</span> & Location
        </h1>
        <p className="page-sub">
          Find towns within a radius of a town or coordinate, or look up which
          town and nation own a specific block.
        </p>
      </div>

      <div className="seg">
        <button
          className={`seg__btn${mode === "nearby" ? " is-active" : ""}`}
          onClick={() => setMode("nearby")}
        >
          Nearby towns
        </button>
        <button
          className={`seg__btn${mode === "location" ? " is-active" : ""}`}
          onClick={() => setMode("location")}
        >
          Location lookup
        </button>
      </div>

      {mode === "nearby" ? (
        <Card className="nearby-form">
          <form onSubmit={runNearby}>
            <div className="field">
              <label htmlFor="target-type">Target type</label>
              <select
                id="target-type"
                className="search__input"
                value={targetType}
                onChange={(e) => {
                  setTargetType(e.target.value as "TOWN" | "COORDINATE");
                  setNearbyResults(null);
                }}
              >
                <option value="TOWN">Town</option>
                <option value="COORDINATE">Coordinate</option>
              </select>
            </div>

            {targetType === "TOWN" ? (
              <div className="field">
                <label htmlFor="town-name">Town name</label>
                <input
                  id="town-name"
                  className="search__input"
                  value={townName}
                  onChange={(e) => setTownName(e.target.value)}
                  placeholder="e.g. London"
                />
              </div>
            ) : (
              <div className="field-row">
                <div className="field">
                  <label htmlFor="nx">X</label>
                  <input
                    id="nx"
                    type="number"
                    className="search__input"
                    value={coords[0]}
                    onChange={(e) => setCoords([Number(e.target.value), coords[1]])}
                  />
                </div>
                <div className="field">
                  <label htmlFor="nz">Z</label>
                  <input
                    id="nz"
                    type="number"
                    className="search__input"
                    value={coords[1]}
                    onChange={(e) => setCoords([coords[0], Number(e.target.value)])}
                  />
                </div>
              </div>
            )}

            <div className="field">
              <label htmlFor="radius">Radius (blocks)</label>
              <input
                id="radius"
                type="number"
                className="search__input"
                value={radius}
                min={1}
                onChange={(e) => setRadius(Number(e.target.value))}
              />
            </div>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner /> : "Search nearby"}
            </Button>
          </form>
        </Card>
      ) : (
        <Card className="nearby-form">
          <form onSubmit={runLocation}>
            <div className="field-row">
              <div className="field">
                <label htmlFor="lx">X</label>
                <input
                  id="lx"
                  type="number"
                  className="search__input"
                  value={locCoords[0]}
                  onChange={(e) => setLocCoords([Number(e.target.value), locCoords[1]])}
                />
              </div>
              <div className="field">
                <label htmlFor="lz">Z</label>
                <input
                  id="lz"
                  type="number"
                  className="search__input"
                  value={locCoords[1]}
                  onChange={(e) => setLocCoords([locCoords[0], Number(e.target.value)])}
                />
              </div>
            </div>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner /> : "Look up block"}
            </Button>
          </form>
        </Card>
      )}

      {error && !loading && (
        <Card style={{ marginTop: "1rem" }}>
          <ErrorState message={error.message} />
        </Card>
      )}

      {/* Nearby results */}
      {mode === "nearby" && nearbyResults && !loading && (
        <Card style={{ marginTop: "1rem" }}>
          {nearbyResults.length === 0 ? (
            <EmptyState
              icon="🧭"
              title="No towns nearby"
              message="Nothing was found within that radius."
            />
          ) : (
            <>
              <h2 className="section-title">
                {nearbyResults.length} town{nearbyResults.length === 1 ? "" : "s"} found
              </h2>
              <div className="chip-row">
                {nearbyResults.map((t) => (
                  <span key={t.uuid} className="badge badge--green">
                    {t.name}
                  </span>
                ))}
              </div>
            </>
          )}
        </Card>
      )}

      {/* Location result */}
      {mode === "location" && location && !loading && (
        <Card style={{ marginTop: "1rem" }} className="loc-result">
          <div className="chip-row" style={{ marginBottom: "0.75rem" }}>
            {location.isWilderness ? (
              <Badge tone="muted">Wilderness</Badge>
            ) : (
              <Badge tone="green">Claimed</Badge>
            )}
            <a
              className="btn btn--ghost btn--sm"
              href={mapUrl({ x: location.location.x, z: location.location.z })}
              target="_blank"
              rel="noopener noreferrer"
            >
              🗺 View on map
            </a>
          </div>
          <div className="datalist">
            <div className="datarow">
              <span className="datarow__label">Coordinate</span>
              <span className="datarow__value mono">
                {location.location.x}, {location.location.z}
              </span>
            </div>
            <div className="datarow">
              <span className="datarow__label">Town</span>
              <span className="datarow__value">{location.town.name || "—"}</span>
            </div>
            <div className="datarow">
              <span className="datarow__label">Nation</span>
              <span className="datarow__value">{location.nation.name || "—"}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Nearby;
