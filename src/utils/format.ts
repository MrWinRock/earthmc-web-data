import { EARTHMC_MAP_URL } from "../config";

const MOON_PHASES: Record<string, string> = {
  NEW_MOON: "🌑",
  WAXING_CRESCENT: "🌒",
  FIRST_QUARTER: "🌓",
  WAXING_GIBBOUS: "🌔",
  FULL_MOON: "🌕",
  WANING_GIBBOUS: "🌖",
  LAST_QUARTER: "🌗",
  WANING_CRESCENT: "🌘",
};

export const getMoonPhaseEmoji = (moonPhase: string): string =>
  MOON_PHASES[moonPhase?.toUpperCase()] ?? "🌙";

export const titleCase = (value: string): string =>
  value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const formatDate = (timestamp: number | null | undefined): string => {
  if (timestamp === null || timestamp === undefined) return "N/A";
  return new Date(timestamp).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const formatRelative = (timestamp: number | null | undefined): string => {
  if (timestamp === null || timestamp === undefined) return "N/A";
  const diff = Date.now() - timestamp;
  const abs = Math.abs(diff);
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60_000, "minute"],
    [3_600_000, "hour"],
    [86_400_000, "day"],
    [2_592_000_000, "month"],
    [31_536_000_000, "year"],
  ];
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  if (abs < 60_000) return "just now";
  let chosen: [number, Intl.RelativeTimeFormatUnit] = units[0];
  for (const u of units) if (abs >= u[0]) chosen = u;
  return rtf.format(Math.round(-diff / chosen[0]), chosen[1]);
};

export const formatNumber = (value: number | null | undefined): string =>
  value === null || value === undefined ? "N/A" : value.toLocaleString();

export const formatGold = (value: number | null | undefined): string =>
  value === null || value === undefined ? "N/A" : `${value.toLocaleString()}G`;

/** Convert a Minecraft time-of-day tick value to a HH:MM clock string. */
export const formatMcClock = (ticks: number): string => {
  const totalMinutes = (((ticks / 1000 + 6) % 24) * 60) % 1440;
  const h = Math.floor(totalMinutes / 60);
  const m = Math.floor(totalMinutes % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

interface MapCoords {
  world?: string;
  x: number;
  y?: number;
  z: number;
  zoom?: number;
}

export const mapUrl = ({ world, x, y = 64, z, zoom = 5 }: MapCoords): string => {
  const w = world && world.includes(":") ? world : "minecraft:overworld";
  return `${EARTHMC_MAP_URL}/?world=${w}&zoom=${zoom}&x=${Math.round(
    x
  )}&y=${Math.round(y)}&z=${Math.round(z)}`;
};

/** Minecraft head avatar from a player UUID (or name). */
export const headUrl = (idOrName: string, size = 64): string =>
  `https://mc-heads.net/avatar/${encodeURIComponent(idOrName)}/${size}`;

export const rgbaToCss = (
  colour: [number, number, number, number] | undefined
): string => {
  if (!colour) return "var(--accent)";
  const [r, g, b, a = 255] = colour;
  return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
};
