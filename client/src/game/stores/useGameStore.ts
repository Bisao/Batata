import { create } from "zustand";
import { STRUCTURE_TYPES, type StructureType } from "../structures/index";

// Define grid cell structure
interface GridCell {
  x: number;
  y: number;
  structure: StructureType | null;
  walkable: boolean;
  buildable: boolean;
}

// Define store state
interface GameState {
  gridSize: number;
  tileSize: number;
  grid: GridCell[][];
  resources: number;
  selectedStructure: StructureType | null;
  hoveredCell: { x: number; y: number } | null;
  structureTypes: typeof STRUCTURE_TYPES;
  
  // Actions
  initializeGame: () => void;
  selectStructure: (structureType: StructureType | null) => void;
  placeStructure: (x: number, y: number, structureType: StructureType) => void;
  removeStructure: (x: number, y: number) => void;
  setHoveredCell: (cell: { x: number; y: number } | null) => void;
  canPlaceStructure: (x: number, y: number, structureType: StructureType) => boolean;
}

// Create the store
export const useGameStore = create<GameState>((set, get) => ({
  gridSize: 20, // Size of the grid (gridSize x gridSize)
  tileSize: 64, // Size of each tile in pixels
  grid: [], // Will be initialized
  resources: 1000, // Starting resources
  selectedStructure: null,
  hoveredCell: null,
  structureTypes: STRUCTURE_TYPES,
  
  // Initialize game state
  initializeGame: () => {
    const { gridSize } = get();
    const newGrid: GridCell[][] = [];
    
    // Create a clean grid
    for (let y = 0; y < gridSize; y++) {
      const row: GridCell[] = [];
      for (let x = 0; x < gridSize; x++) {
        row.push({
          x,
          y,
          structure: null,
          walkable: true,
          buildable: true
        });
      }
      newGrid.push(row);
    }
    
    set({ grid: newGrid });
  },
  
  // Select a structure type
  selectStructure: (structureType) => {
    set({ selectedStructure: structureType });
  },
  
  // Place a structure on the grid
  placeStructure: (x, y, structureType) => {
    const { grid, resources, structureTypes } = get();
    
    // Check if we can afford it
    const cost = structureTypes[structureType].cost;
    if (resources < cost) {
      console.log("Not enough resources!");
      return;
    }
    
    // Check if the cell is valid for building
    if (!get().canPlaceStructure(x, y, structureType)) {
      console.log("Can't place structure here!");
      return;
    }
    
    // Update the grid
    const newGrid = [...grid];
    newGrid[y][x] = {
      ...newGrid[y][x],
      structure: structureType,
      walkable: !structureTypes[structureType].blocksMovement
    };
    
    // Update state
    set({
      grid: newGrid,
      resources: resources - cost
    });
  },
  
  // Remove a structure from the grid
  removeStructure: (x, y) => {
    const { grid } = get();
    
    // Check if there's a structure
    if (!grid[y][x].structure) {
      return;
    }
    
    // Update the grid
    const newGrid = [...grid];
    newGrid[y][x] = {
      ...newGrid[y][x],
      structure: null,
      walkable: true
    };
    
    set({ grid: newGrid });
  },
  
  // Set the currently hovered cell
  setHoveredCell: (cell) => {
    set({ hoveredCell: cell });
  },
  
  // Check if a structure can be placed at the given coordinates
  canPlaceStructure: (x, y, structureType) => {
    const { grid, gridSize } = get();
    
    // Check bounds
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
      return false;
    }
    
    // Check if the cell is buildable and doesn't have a structure already
    return grid[y][x].buildable && !grid[y][x].structure;
  }
}));
