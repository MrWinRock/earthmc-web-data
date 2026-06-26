export type NearbyTargetType = "TOWN" | "COORDINATE";
export type NearbySearchType = "TOWN";

export interface NearbyQuery {
  target_type: NearbyTargetType;
  target: string | [number, number];
  search_type: NearbySearchType;
  radius: number;
}

export interface NearbyResult {
  name: string;
  uuid: string;
}

/** Towny data for a single [x, z] coordinate. */
export interface LocationResult {
  location: { x: number; z: number };
  isWilderness: boolean;
  town: { name: string | null; uuid: string | null };
  nation: { name: string | null; uuid: string | null };
}
