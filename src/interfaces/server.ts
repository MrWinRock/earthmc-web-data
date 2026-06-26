export interface ServerStatus {
  version: string;
  moonPhase: string;
  timestamps: {
    newDayTime: number;
    serverTimeOfDay: number;
  };
  status: {
    hasStorm: boolean;
    isThundering: boolean;
  };
  stats: {
    time: number;
    fullTime: number;
    maxPlayers: number;
    numOnlinePlayers: number;
    numOnlineNomads: number;
    numResidents: number;
    numNomads: number;
    numTowns: number;
    numTownBlocks: number;
    numNations: number;
    numQuarters: number;
    numCuboids: number;
  };
  voteParty: {
    target: number;
    numRemaining: number;
  };
}
