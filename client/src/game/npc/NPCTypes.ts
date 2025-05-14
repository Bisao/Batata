
export enum NPCState {
  IDLE = 'idle',
  WALKING = 'walking',
  WORKING = 'working',
  RESTING = 'resting'
}

export enum NPCProfession {
  FARMER = 'farmer',
  FISHERMAN = 'fisherman',
  LUMBERJACK = 'lumberjack',
  MINER = 'miner'
}

export interface NPCData {
  id: string;
  name: string;
  state: NPCState;
  profession: NPCProfession;
  x: number;
  y: number;
  speed: number;
  level: number;
  xp: number;
  maxXp: number;
  homeId: string;
}
