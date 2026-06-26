import axios from "axios";
import { EARTHMC_API_URL } from "../config";
import type { ServerStatus } from "../interfaces/server";
import type { OnlineResponse } from "../interfaces/online";
import type { PlayerBasic, PlayerDetailed } from "../interfaces/player";
import type { TownBasic, TownDetailed } from "../interfaces/town";
import type { NationBasic, NationDetailed } from "../interfaces/nation";
import type { QuarterBasic, QuarterDetailed } from "../interfaces/quarter";
import type {
  NearbyQuery,
  NearbyResult,
  LocationResult,
} from "../interfaces/nearby";

export const http = axios.create({ baseURL: EARTHMC_API_URL });

/**
 * The EarthMC v4 API accepts a JSON body of `{ query, template }` on its POST
 * endpoints. We send it with `Content-Type: text/plain` on purpose: that keeps
 * the request a CORS "simple request" and avoids an OPTIONS preflight the API
 * does not answer. Do not switch to application/json — it breaks in-browser.
 */
async function postQuery<T>(
  path: string,
  query: unknown[],
  options: { template?: Record<string, unknown>; signal?: AbortSignal } = {}
): Promise<T> {
  const body: Record<string, unknown> = { query };
  if (options.template) body.template = options.template;
  const res = await http.post<T>(path, JSON.stringify(body), {
    headers: { "Content-Type": "text/plain" },
    signal: options.signal,
  });
  return res.data;
}

const get = async <T>(path: string, signal?: AbortSignal): Promise<T> =>
  (await http.get<T>(path, { signal })).data;

/** Normalize any thrown value into an Error with a readable message. */
export function toError(err: unknown, fallback = "Something went wrong"): Error {
  if (axios.isCancel(err)) return new Error("cancelled");
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    if (status === 429)
      return new Error("Rate limited by the API — try again shortly.");
    if (status) return new Error(`Request failed (HTTP ${status}).`);
    return new Error(err.message || fallback);
  }
  if (err instanceof Error) return err;
  return new Error(String(err ?? fallback));
}

export const isCancel = (err: unknown): boolean =>
  axios.isCancel(err) || (err instanceof Error && err.message === "cancelled");

export const api = {
  serverStatus: (signal?: AbortSignal) => get<ServerStatus>("", signal),
  online: (signal?: AbortSignal) => get<OnlineResponse>("/online", signal),

  listPlayers: (signal?: AbortSignal) => get<PlayerBasic[]>("/players", signal),
  listTowns: (signal?: AbortSignal) => get<TownBasic[]>("/towns", signal),
  listNations: (signal?: AbortSignal) => get<NationBasic[]>("/nations", signal),
  listQuarters: (signal?: AbortSignal) =>
    get<QuarterBasic[]>("/quarters", signal),

  queryPlayers: (ids: string[], signal?: AbortSignal) =>
    postQuery<PlayerDetailed[]>("/players", ids, { signal }),
  queryTowns: (ids: string[], signal?: AbortSignal) =>
    postQuery<TownDetailed[]>("/towns", ids, { signal }),
  queryNations: (ids: string[], signal?: AbortSignal) =>
    postQuery<NationDetailed[]>("/nations", ids, { signal }),
  queryQuarters: (ids: string[], signal?: AbortSignal) =>
    postQuery<QuarterDetailed[]>("/quarters", ids, { signal }),

  nearby: (query: NearbyQuery, signal?: AbortSignal) =>
    postQuery<NearbyResult[][]>("/nearby", [query], { signal }),
  location: (coords: [number, number], signal?: AbortSignal) =>
    postQuery<LocationResult[]>("/location", [coords], { signal }),
};
