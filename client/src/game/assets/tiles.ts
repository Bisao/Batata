/**
 * Defines the tile types and their rendering properties
 */

export interface TileType {
  id: string;
  name: string;
  color: string;
  walkable: boolean;
  buildable: boolean;
}

export const TILE_TYPES = {
  grass: {
    id: "grass",
    name: "Grass",
    color: "#7cba5d",
    walkable: true,
    buildable: true,
  },
  
  water: {
    id: "water",
    name: "Water",
    color: "#5d95ba",
    walkable: false,
    buildable: false,
  },
  
  mountain: {
    id: "mountain",
    name: "Mountain",
    color: "#a1a1a1",
    walkable: false,
    buildable: false,
  },
  
  sand: {
    id: "sand",
    name: "Sand",
    color: "#e8db84",
    walkable: true,
    buildable: true,
  },
  
  forest: {
    id: "forest",
    name: "Forest",
    color: "#3e7943",
    walkable: true,
    buildable: true,
  }
};

export type TileTypeId = keyof typeof TILE_TYPES;
