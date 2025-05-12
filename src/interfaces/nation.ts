export interface NationResident {
  name: string;
  uuid: string;
}

export interface NationTown {
  name: string;
  uuid: string;
}

export interface NationAlly {
  name: string;
  uuid: string;
}

export interface NationEnemy {
  name: string;
  uuid: string;
}

export interface NationCapital {
  name: string;
  uuid: string;
}

export interface NationKing {
  name: string;
  uuid: string;
}

export interface NationTimestamps {
  registered: number;
}

export interface NationStatus {
  isPublic: boolean;
  isOpen: boolean;
  isNeutral: boolean;
}

export interface NationStats {
  numTownBlocks: number;
  numResidents: number;
  numTowns: number;
  numAllies: number;
  numEnemies: number;
  balance: number;
}

export interface NationCoordinatesSpawn {
  world: string;
  x: number;
  y: number;
  z: number;
  pitch: number;
  yaw: number;
}

export interface NationCoordinates {
  spawn: NationCoordinatesSpawn;
}

export interface NationDetailed {
  name: string;
  uuid: string;
  board: string | null;
  dynmap: {
    colour: string;
    outline: string;
  };
  wiki: string | null;
  king: NationKing;
  capital: NationCapital;
  timestamps: NationTimestamps;
  status: NationStatus;
  stats: NationStats;
  coordinates: NationCoordinates;
  residents: NationResident[];
  towns: NationTown[];
  allies: NationAlly[];
  enemies: NationEnemy[];
  sanctioned: NationTown[];
  ranks: Record<string, NationResident[]>;
  colonist: NationResident[];
  diplomat: NationResident[];
}
