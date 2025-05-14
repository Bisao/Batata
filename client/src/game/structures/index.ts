/**
 * Defines the structure types available in the game
 */

export interface StructureData {
  id: string;
  name: string;
  icon: string;
  description: string;
  cost: number;
  size: {
    width: number;
    height: number;
  };
  buildTime: number;
  blocksMovement: boolean;
}

export const STRUCTURE_TYPES: Record<string, StructureData> = {
  // Original structures
  house: {
    id: "house",
    name: "House",
    icon: "🏠",
    description: "Basic housing for your citizens. Provides population capacity.",
    cost: 100,
    size: { width: 1, height: 1 },
    buildTime: 2,
    blocksMovement: true,
  },
  
  factory: {
    id: "factory",
    name: "Factory",
    icon: "🏭",
    description: "Industrial building that produces goods and resources.",
    cost: 250,
    size: { width: 1, height: 1 },
    buildTime: 5,
    blocksMovement: true,
  },
  
  farm: {
    id: "farm",
    name: "Farm",
    icon: "🌾",
    description: "Provides food resources for your population.",
    cost: 150,
    size: { width: 1, height: 1 },
    buildTime: 3,
    blocksMovement: false,
  },
  
  tower: {
    id: "tower",
    name: "Tower",
    icon: "🗼",
    description: "Defensive structure that provides visibility and security.",
    cost: 200,
    size: { width: 1, height: 1 },
    buildTime: 4,
    blocksMovement: true,
  },
  
  // Novas estruturas
  water_well: {
    id: "water_well",
    name: "Water Well",
    icon: "💧",
    description: "Provides water for your citizens and farms.",
    cost: 120,
    size: { width: 1, height: 1 },
    buildTime: 2,
    blocksMovement: true,
  },
  
  windmill: {
    id: "windmill",
    name: "Windmill",
    icon: "🌬️",
    description: "Processes grain into flour for food production.",
    cost: 180,
    size: { width: 1, height: 1 },
    buildTime: 4,
    blocksMovement: true,
  },
  
  farmer_house: {
    id: "farmer_house",
    name: "Farmer House",
    icon: "👨‍🌾",
    description: "Home for farmers who work in the fields.",
    cost: 130,
    size: { width: 1, height: 1 },
    buildTime: 3,
    blocksMovement: true,
  },
  
  fisherman_house: {
    id: "fisherman_house",
    name: "Fisherman House",
    icon: "🎣",
    description: "Home for fishermen who catch fish from nearby waters.",
    cost: 140,
    size: { width: 1, height: 1 },
    buildTime: 3,
    blocksMovement: true,
  },
  
  lumberjack_house: {
    id: "lumberjack_house",
    name: "Lumberjack House",
    icon: "🪓",
    description: "Home for lumberjacks who collect wood from forests.",
    cost: 150,
    size: { width: 1, height: 1 },
    buildTime: 3,
    blocksMovement: true,
  },
  
  miner_house: {
    id: "miner_house",
    name: "Miner House",
    icon: "⛏️",
    description: "Home for miners who extract minerals from mountains.",
    cost: 160,
    size: { width: 1, height: 1 },
    buildTime: 3,
    blocksMovement: true,
  },
  
  silo: {
    id: "silo",
    name: "Silo",
    icon: "🌽",
    description: "Stores grain and other agricultural products.",
    cost: 170,
    size: { width: 1, height: 1 },
    buildTime: 3,
    blocksMovement: true,
  }
};

export type StructureType = keyof typeof STRUCTURE_TYPES;
