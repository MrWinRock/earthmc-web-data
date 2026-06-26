// EarthMC v4 API base URL. Override at build time with VITE_API_URL if needed.
export const EARTHMC_API_URL =
  import.meta.env.VITE_API_URL ?? "https://api.earthmc.net/v4";

// Public Dynmap/Map base used for "View on map" links.
export const EARTHMC_MAP_URL = "https://map.earthmc.net";
