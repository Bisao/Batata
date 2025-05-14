/**
 * TileManager.ts
 * Sistema responsável por gerenciar os diferentes tipos de tiles (azulejos)
 */

import { TileType } from '../assets/tiles';

// Interface que define um tile do mapa
export interface Tile {
  id: string;
  type: string;
  x: number;
  y: number;
  walkable: boolean;
  buildable: boolean;
  variant?: number; // Variação visual do tile (por exemplo, diferentes tipos de grama)
}

export class TileManager {
  private tiles: Map<string, Tile> = new Map();
  private tileTypes: Record<string, TileType>;

  constructor(tileTypes: Record<string, TileType>) {
    this.tileTypes = tileTypes;
  }

  // Adiciona um novo tile no mapa
  addTile(x: number, y: number, typeId: string, variant: number = 0): Tile {
    const tileType = this.tileTypes[typeId];
    if (!tileType) {
      throw new Error(`Tipo de tile desconhecido: ${typeId}`);
    }

    const key = `${x},${y}`;
    const tile: Tile = {
      id: key,
      type: typeId,
      x,
      y,
      walkable: tileType.walkable,
      buildable: tileType.buildable,
      variant
    };

    this.tiles.set(key, tile);
    return tile;
  }

  // Obtém um tile específico por coordenadas
  getTile(x: number, y: number): Tile | undefined {
    return this.tiles.get(`${x},${y}`);
  }

  // Atualiza um tile existente
  updateTile(x: number, y: number, updates: Partial<Tile>): Tile | undefined {
    const key = `${x},${y}`;
    const tile = this.tiles.get(key);
    
    if (!tile) return undefined;
    
    const updatedTile = { ...tile, ...updates };
    this.tiles.set(key, updatedTile);
    
    return updatedTile;
  }

  // Remove um tile
  removeTile(x: number, y: number): boolean {
    return this.tiles.delete(`${x},${y}`);
  }

  // Verifica se um tile é caminhável
  isWalkable(x: number, y: number): boolean {
    const tile = this.getTile(x, y);
    return tile ? tile.walkable : false;
  }

  // Verifica se é possível construir em um tile
  isBuildable(x: number, y: number): boolean {
    const tile = this.getTile(x, y);
    return tile ? tile.buildable : false;
  }

  // Obtém todos os tiles
  getAllTiles(): Tile[] {
    return Array.from(this.tiles.values());
  }
}