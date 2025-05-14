/**
 * TerrainManager.ts
 * Gerencia o terreno do jogo, integrando tiles e objetos
 */

import { TileManager, Tile } from '../tiles/TileManager';
import { ObjectManager } from '../objects/ObjectManager';
import { TILE_TYPES } from '../assets/tiles';
import { GameObjectType } from '../objects/GameObjects';
import { NPCManager } from '../npc/NPCManager';

export class TerrainManager {
  private tileManager: TileManager;
  private objectManager: ObjectManager;
  private npcManager: NPCManager;
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.tileManager = new TileManager(TILE_TYPES);
    this.objectManager = new ObjectManager();
    this.npcManager = new NPCManager();
  }

  getNPCs() {
    return this.npcManager.getAllNPCs();
  }

  createNPC(data: NPCData) {
    return this.npcManager.createNPC(data);
  }

  getNPCManager() {
    return this.npcManager;
  }

  // Inicializa o terreno com um tile padrão
  initializeEmptyTerrain(defaultTileType: string = 'grass'): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // Criar tile com variante aleatória para mais diversidade visual
        const variant = Math.floor(Math.random() * 4) + 1; // 1-4 para grama
        this.tileManager.addTile(x, y, defaultTileType, variant);
      }
    }
  }

  // Gera um terreno com paisagem natural
  generateNaturalTerrain(): void {
    // Inicializa com grama
    this.initializeEmptyTerrain('grass');

    // Adiciona alguma variação ao terreno
    this.addWaterBodies();
    this.addMountains();
    this.addForests();
    this.addRocks();
  }

  // Adiciona corpos d'água ao terreno
  private addWaterBodies(): void {
    // Lógica para adicionar lagos e rios
    const numLakes = Math.floor(Math.random() * 3) + 1; // 1-3 lagos

    for (let lakeIndex = 0; lakeIndex < numLakes; lakeIndex++) {
      const lakeX = Math.floor(Math.random() * (this.width - 5)) + 2;
      const lakeY = Math.floor(Math.random() * (this.height - 5)) + 2;
      const lakeSize = Math.floor(Math.random() * 3) + 2; // 2-4 tamanho

      // Gerar lago
      for (let y = -lakeSize; y <= lakeSize; y++) {
        for (let x = -lakeSize; x <= lakeSize; x++) {
          const distance = Math.sqrt(x*x + y*y);
          if (distance <= lakeSize) {
            const terrainX = lakeX + x;
            const terrainY = lakeY + y;

            // Verificar se está dentro dos limites
            if (terrainX >= 0 && terrainX < this.width && terrainY >= 0 && terrainY < this.height) {
              this.tileManager.updateTile(terrainX, terrainY, { type: 'water', walkable: false, buildable: false });
            }
          }
        }
      }
    }
  }

  // Adiciona montanhas ao terreno
  private addMountains(): void {
    const numMountains = Math.floor(Math.random() * 4) + 2; // 2-5 montanhas

    for (let i = 0; i < numMountains; i++) {
      const mountainX = Math.floor(Math.random() * (this.width - 4)) + 2;
      const mountainY = Math.floor(Math.random() * (this.height - 4)) + 2;
      const mountainSize = Math.floor(Math.random() * 2) + 1; // 1-2 tamanho

      // Gerar montanha
      for (let y = -mountainSize; y <= mountainSize; y++) {
        for (let x = -mountainSize; x <= mountainSize; x++) {
          const distance = Math.sqrt(x*x + y*y);
          if (distance <= mountainSize) {
            const terrainX = mountainX + x;
            const terrainY = mountainY + y;

            // Verificar se está dentro dos limites
            if (terrainX >= 0 && terrainX < this.width && terrainY >= 0 && terrainY < this.height) {
              this.tileManager.updateTile(terrainX, terrainY, { type: 'mountain', walkable: false, buildable: false });
            }
          }
        }
      }
    }
  }

  // Adiciona florestas de árvores ao terreno
  private addForests(): void {
    const numForests = Math.floor(Math.random() * 3) + 2; // 2-4 florestas

    for (let i = 0; i < numForests; i++) {
      const forestX = Math.floor(Math.random() * (this.width - 6)) + 3;
      const forestY = Math.floor(Math.random() * (this.height - 6)) + 3;
      const forestSize = Math.floor(Math.random() * 3) + 3; // 3-5 tamanho de floresta
      const forestDensity = 0.6; // Probabilidade de ter uma árvore em cada célula

      // Primeiro, alteramos o tipo de terreno para floresta
      for (let y = -forestSize; y <= forestSize; y++) {
        for (let x = -forestSize; x <= forestSize; x++) {
          const distance = Math.sqrt(x*x + y*y);
          if (distance <= forestSize) {
            const terrainX = forestX + x;
            const terrainY = forestY + y;

            // Verificar se está dentro dos limites
            if (terrainX >= 0 && terrainX < this.width && terrainY >= 0 && terrainY < this.height) {
              // Muda o tipo de tile para floresta
              this.tileManager.updateTile(terrainX, terrainY, { type: 'forest' });

              // Chance de adicionar uma árvore como objeto
              if (Math.random() < forestDensity) {
                // Escolhe aleatoriamente um tipo de árvore
                const treeTypes = [
                  GameObjectType.TREE_SIMPLE,
                  GameObjectType.TREE_PINE,
                  GameObjectType.TREE_FRUIT,
                  GameObjectType.TREE_AUTUMN
                ];
                const randomTreeType = treeTypes[Math.floor(Math.random() * treeTypes.length)];

                // Adiciona a árvore se não houver um objeto nessa posição
                if (!this.objectManager.hasObjectAt(terrainX, terrainY)) {
                  // Rotação aleatória para mais variedade
                  const rotation = Math.floor(Math.random() * 360);
                  this.objectManager.addObject(terrainX, terrainY, randomTreeType, rotation);
                }
              }
            }
          }
        }
      }
    }
  }

  // Adiciona rochas espalhadas pelo terreno
  private addRocks(): void {
    const numRocks = Math.floor(Math.random() * 10) + 5; // 5-14 rochas

    for (let i = 0; i < numRocks; i++) {
      const rockX = Math.floor(Math.random() * this.width);
      const rockY = Math.floor(Math.random() * this.height);

      // Verifica se o local está livre
      if (!this.objectManager.hasObjectAt(rockX, rockY)) {
        // Escolhe aleatoriamente um tipo de rocha
        const rockTypes = [
          GameObjectType.ROCK_SMALL,
          GameObjectType.ROCK_MEDIUM,
          GameObjectType.ROCK_BIG
        ];
        const randomRockType = rockTypes[Math.floor(Math.random() * rockTypes.length)];

        // Rotação aleatória
        const rotation = Math.floor(Math.random() * 360);
        this.objectManager.addObject(rockX, rockY, randomRockType, rotation);
      }
    }
  }

  // Verifica se a posição está dentro dos limites do mapa
  isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  // Verifica se a posição está ocupada (não pode construir)
  isPositionOccupied(x: number, y: number): boolean {
    // Verifica se o tile permite construção
    const tile = this.tileManager.getTile(x, y);
    if (!tile || !tile.buildable) {
      return true;
    }

    // Verifica se há um objeto que bloqueia construção
    return this.objectManager.isPositionBlockedForBuilding(x, y);
  }

  // Verifica se um personagem pode caminhar por esta posição
  isPositionWalkable(x: number, y: number): boolean {
    // Verifica se o tile permite caminhada
    const tile = this.tileManager.getTile(x, y);
    if (!tile || !tile.walkable) {
      return false;
    }

    // Verifica se há um objeto que bloqueia movimento
    return !this.objectManager.isPositionBlockedForMovement(x, y);
  }

  // Retorna todos os tiles
  getAllTiles(): Tile[] {
    return this.tileManager.getAllTiles();
  }

  // Retorna o gerenciador de objetos
  getObjectManager(): ObjectManager {
    return this.objectManager;
  }

  // Retorna o gerenciador de tiles
  getTileManager(): TileManager {
    return this.tileManager;
  }

  // Tamanho do terreno
  getSize(): { width: number, height: number } {
    return { width: this.width, height: this.height };
  }
}