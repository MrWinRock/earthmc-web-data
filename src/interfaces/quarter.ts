export interface QuarterBasic {
  name: string;
  uuid: string;
}

export interface QuarterOwner {
  name: string | null;
  uuid: string | null;
}

export interface QuarterTown {
  name: string | null;
  uuid: string | null;
}

export interface QuarterNation {
  name: string | null;
  uuid: string | null;
}

export interface QuarterTimestamps {
  registered: number;
  claimedAt: number | null;
}

export interface QuarterStatus {
  isEmbassy: boolean;
  isForSale: boolean;
}

export interface QuarterStats {
  price: number | null;
  volume: number;
  numCuboids: number;
  particleSize: number | null;
}

export interface QuarterCuboid {
  cornerOne: [number, number, number];
  cornerTwo: [number, number, number];
}

export interface QuarterDetailed extends QuarterBasic {
  type: string;
  creator: string;
  owner: QuarterOwner;
  town: QuarterTown;
  nation: QuarterNation;
  timestamps: QuarterTimestamps;
  status: QuarterStatus;
  stats: QuarterStats;
  /** RGBA, each 0-255. */
  colour: [number, number, number, number];
  trusted: { name: string; uuid: string }[];
  cuboids: QuarterCuboid[];
}
