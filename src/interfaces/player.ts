// filepath: d:\Coding\earthmc-web-data\src\types\playerTypes.ts
export interface PlayerBasic {
  name: string;
  uuid: string;
}

export interface PlayerTown {
  name: string | null;
  uuid: string | null;
}

export interface PlayerNation {
  name: string | null;
  uuid: string | null;
}

export interface PlayerTimestamps {
  registered: number;
  joinedTownAt: number | null;
  lastOnline: number | null;
}

export interface PlayerStatus {
  isOnline: boolean;
  isNPC: boolean;
  isMayor: boolean;
  isKing: boolean;
  hasTown: boolean;
  hasNation: boolean;
}

export interface PlayerStats {
  balance: number;
  numFriends: number;
}

export interface PlayerPermsFlags {
  pvp: boolean;
  explosion: boolean;
  fire: boolean;
  mobs: boolean;
}

export interface PlayerPerms {
  build: boolean[];
  destroy: boolean[];
  switch: boolean[];
  itemUse: boolean[];
  flags: PlayerPermsFlags;
}

export interface PlayerRanks {
  townRanks: string[];
  nationRanks: string[];
}

export interface PlayerFriend {
  name: string;
  uuid: string;
}

export interface PlayerDetailed extends PlayerBasic {
  title: string | null;
  surname: string | null;
  formattedName: string;
  about: string | null;
  town: PlayerTown;
  nation: PlayerNation;
  timestamps: PlayerTimestamps;
  status: PlayerStatus;
  stats: PlayerStats;
  perms: PlayerPerms;
  ranks: PlayerRanks;
  friends: PlayerFriend[];
}
