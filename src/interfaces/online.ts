export interface OnlinePlayer {
  name: string;
  uuid: string;
}

export interface OnlineResponse {
  count: number;
  players: OnlinePlayer[];
}
