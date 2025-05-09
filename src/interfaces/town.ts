export interface TownBasic {
  name: string;
  uuid: string;
}

export interface TownMayor {
  name: string;
  uuid: string;
}

export interface TownNation {
  name: string | null;
  uuid: string | null;
}

export interface TownTimestamps {
  registered: number;
  joinedNationAt: number | null;
  ruinedAt: number | null;
}

export interface TownStatus {
  isPublic: boolean;
  isOpen: boolean;
  isNeutral: boolean;
  isCapital: boolean;
  isOverClaimed: boolean;
  isRuined: boolean;
  isForSale: boolean;
  hasNation: boolean;
  hasOverclaimShield: boolean;
  canOutsidersSpawn: boolean;
}

export interface TownStats {
  numTownBlocks: number;
  maxTownBlocks: number;
  numResidents: number;
  numTrusted: number;
  numOutlaws: number;
  balance: number;
  forSalePrice: number | null;
}

export interface TownPermsFlags {
  pvp: boolean;
  explosion: boolean;
  fire: boolean;
  mobs: boolean;
}

export interface TownPerms {
  build: boolean[];
  destroy: boolean[];
  switch: boolean[];
  itemUse: boolean[];
  flags: TownPermsFlags;
}

export interface TownCoordinatesSpawn {
  world: string;
  x: number;
  y: number;
  z: number;
  pitch: number;
  yaw: number;
}

export interface TownCoordinates {
  spawn: TownCoordinatesSpawn;
  homeBlock: [number, number];
  townBlocks: [number, number][];
}

export interface TownResident {
  name: string;
  uuid: string;
}

export interface TownDetailed extends TownBasic {
  board: string | null;
  founder: string;
  wiki: string | null;
  mayor: TownMayor;
  nation: TownNation;
  timestamps: TownTimestamps;
  status: TownStatus;
  stats: TownStats;
  perms: TownPerms;
  coordinates: TownCoordinates;
  residents: TownResident[];
  trusted: TownResident[];
  outlaws: TownResident[];
  quarters: string[];
  ranks: Record<string, string[]>;
}
