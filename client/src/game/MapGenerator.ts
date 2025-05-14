/**
 * MapGenerator.ts
 * Responsável por gerar mapas com diferentes temas e configurações
 */

import { TerrainManager } from './terrain/TerrainManager';
import { GameObjectType } from './objects/GameObjects';

export enum MapTheme {
  DEFAULT = 'default',
  FOREST = 'forest',
  DESERT = 'desert',
  MOUNTAINS = 'mountains',
  MIXED = 'mixed'
}

export interface MapConfig {
  width: number;
  height: number;
  theme: MapTheme;
  seed?: number; // Para geração determinística (opcional)
}

export class MapGenerator {
  private config: MapConfig;
  
  constructor(config: MapConfig) {
    this.config = config;
  }
  
  // Gera um mapa baseado na configuração
  generate(): TerrainManager {
    const { width, height, theme } = this.config;
    const terrainManager = new TerrainManager(width, height);
    
    switch (theme) {
      case MapTheme.FOREST:
        this.generateForestMap(terrainManager);
        break;
      case MapTheme.DESERT:
        this.generateDesertMap(terrainManager);
        break;
      case MapTheme.MOUNTAINS:
        this.generateMountainMap(terrainManager);
        break;
      case MapTheme.MIXED:
        this.generateMixedMap(terrainManager);
        break;
      case MapTheme.DEFAULT:
      default:
        this.generateDefaultMap(terrainManager);
        break;
    }
    
    return terrainManager;
  }
  
  // Gera um mapa padrão balanceado
  private generateDefaultMap(terrain: TerrainManager): void {
    // Inicializa com grama
    terrain.initializeEmptyTerrain('grass');
    
    // Adiciona características básicas
    this.addWaterFeatures(terrain, 0.15); // 15% de água
    this.addTrees(terrain, 0.1); // 10% de árvores
    this.addRocks(terrain, 0.05); // 5% de rochas
  }
  
  // Gera um mapa de floresta densa
  private generateForestMap(terrain: TerrainManager): void {
    // Inicializa com terreno de floresta
    terrain.initializeEmptyTerrain('forest');
    
    // Mais árvores, menos água
    this.addWaterFeatures(terrain, 0.1); // 10% de água
    this.addTrees(terrain, 0.3); // 30% de árvores (floresta densa)
    this.addRocks(terrain, 0.05); // 5% de rochas
  }
  
  // Gera um mapa de deserto
  private generateDesertMap(terrain: TerrainManager): void {
    const { width, height } = terrain.getSize();
    
    // Inicializa com areia
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        terrain.getTileManager().addTile(x, y, 'sand');
      }
    }
    
    // Oásis ocasionais e rochas
    this.addOases(terrain);
    this.addRocks(terrain, 0.08); // 8% de rochas
  }
  
  // Gera um mapa montanhoso
  private generateMountainMap(terrain: TerrainManager): void {
    // Inicializa com terreno básico
    terrain.initializeEmptyTerrain('grass');
    
    // Adiciona muitas montanhas
    this.addMountains(terrain, 0.3); // 30% montanhas
    this.addWaterFeatures(terrain, 0.15); // 15% de água (rios/lagos)
    this.addTrees(terrain, 0.1); // 10% de árvores
    this.addRocks(terrain, 0.15); // 15% de rochas
  }
  
  // Gera um mapa misto com todos os elementos
  private generateMixedMap(terrain: TerrainManager): void {
    const { width, height } = terrain.getSize();
    
    // Divide o mapa em 4 quadrantes com diferentes biomas
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Determina o quadrante
        const isLeft = x < width / 2;
        const isTop = y < height / 2;
        
        let tileType = 'grass'; // Padrão
        
        if (isLeft && isTop) {
          tileType = 'forest'; // Quadrante superior esquerdo: floresta
        } else if (!isLeft && isTop) {
          tileType = 'mountain'; // Quadrante superior direito: montanha
        } else if (isLeft && !isTop) {
          tileType = 'grass'; // Quadrante inferior esquerdo: gramado
        } else {
          tileType = 'sand'; // Quadrante inferior direito: deserto
        }
        
        terrain.getTileManager().addTile(x, y, tileType);
      }
    }
    
    // Adiciona elementos específicos para cada bioma
    this.addMixedFeatures(terrain);
  }
  
  // Adiciona características específicas ao mapa misto
  private addMixedFeatures(terrain: TerrainManager): void {
    const { width, height } = terrain.getSize();
    const objectManager = terrain.getObjectManager();
    
    // Adiciona elementos específicos para cada quadrante
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tile = terrain.getTileManager().getTile(x, y);
        if (!tile) continue;
        
        // Pula se já existir um objeto nesta posição
        if (objectManager.hasObjectAt(x, y)) continue;
        
        // Adiciona elementos com base no tipo de tile
        if (tile.type === 'forest' && Math.random() < 0.3) {
          const treeTypes = [
            GameObjectType.TREE_SIMPLE,
            GameObjectType.TREE_PINE
          ];
          const treeType = treeTypes[Math.floor(Math.random() * treeTypes.length)];
          objectManager.addObject(x, y, treeType);
        } else if (tile.type === 'mountain' && Math.random() < 0.3) {
          objectManager.addObject(x, y, GameObjectType.ROCK_BIG);
        } else if (tile.type === 'grass' && Math.random() < 0.15) {
          const treeTypes = [
            GameObjectType.TREE_SIMPLE,
            GameObjectType.TREE_FRUIT
          ];
          const treeType = treeTypes[Math.floor(Math.random() * treeTypes.length)];
          objectManager.addObject(x, y, treeType);
        } else if (tile.type === 'sand' && Math.random() < 0.1) {
          objectManager.addObject(x, y, GameObjectType.ROCK_SMALL);
        }
      }
    }
  }
  
  // Adiciona recursos de água (lagos e rios)
  private addWaterFeatures(terrain: TerrainManager, density: number): void {
    const { width, height } = terrain.getSize();
    const tileManager = terrain.getTileManager();
    
    // Lagos
    const numLakes = Math.floor(width * height * density * 0.01);
    for (let i = 0; i < numLakes; i++) {
      const lakeX = Math.floor(Math.random() * width);
      const lakeY = Math.floor(Math.random() * height);
      const lakeSize = Math.floor(Math.random() * 3) + 2;
      
      // Cria o lago
      for (let y = -lakeSize; y <= lakeSize; y++) {
        for (let x = -lakeSize; x <= lakeSize; x++) {
          const distance = Math.sqrt(x*x + y*y);
          if (distance <= lakeSize) {
            const tileX = lakeX + x;
            const tileY = lakeY + y;
            
            if (tileX >= 0 && tileX < width && tileY >= 0 && tileY < height) {
              tileManager.updateTile(tileX, tileY, {
                type: 'water',
                walkable: false,
                buildable: false
              });
            }
          }
        }
      }
    }
  }
  
  // Adiciona árvores ao terreno
  private addTrees(terrain: TerrainManager, density: number): void {
    const { width, height } = terrain.getSize();
    const objectManager = terrain.getObjectManager();
    const tileManager = terrain.getTileManager();
    
    // Número total de árvores com base na densidade
    const numTrees = Math.floor(width * height * density);
    
    for (let i = 0; i < numTrees; i++) {
      // Posição aleatória
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      
      // Verifica se o local é adequado para árvores
      const tile = tileManager.getTile(x, y);
      if (tile && tile.walkable && tile.buildable && !objectManager.hasObjectAt(x, y)) {
        // Escolhe um tipo de árvore aleatório
        const treeTypes = [
          GameObjectType.TREE_SIMPLE,
          GameObjectType.TREE_PINE,
          GameObjectType.TREE_FRUIT,
          GameObjectType.TREE_AUTUMN
        ];
        const treeType = treeTypes[Math.floor(Math.random() * treeTypes.length)];
        
        // Rotação aleatória para variedade
        const rotation = Math.floor(Math.random() * 360);
        objectManager.addObject(x, y, treeType, rotation);
      }
    }
  }
  
  // Adiciona rochas ao terreno
  private addRocks(terrain: TerrainManager, density: number): void {
    const { width, height } = terrain.getSize();
    const objectManager = terrain.getObjectManager();
    const tileManager = terrain.getTileManager();
    
    // Número total de rochas com base na densidade
    const numRocks = Math.floor(width * height * density);
    
    for (let i = 0; i < numRocks; i++) {
      // Posição aleatória
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      
      // Verifica se o local é adequado para rochas
      const tile = tileManager.getTile(x, y);
      if (tile && !objectManager.hasObjectAt(x, y)) {
        // Escolhe um tipo de rocha aleatório
        const rockTypes = [
          GameObjectType.ROCK_SMALL,
          GameObjectType.ROCK_MEDIUM,
          GameObjectType.ROCK_BIG
        ];
        const rockType = rockTypes[Math.floor(Math.random() * rockTypes.length)];
        
        // Rotação aleatória para variedade
        const rotation = Math.floor(Math.random() * 360);
        objectManager.addObject(x, y, rockType, rotation);
      }
    }
  }
  
  // Adiciona montanhas ao terreno
  private addMountains(terrain: TerrainManager, density: number): void {
    const { width, height } = terrain.getSize();
    const tileManager = terrain.getTileManager();
    
    // Número de áreas montanhosas
    const numMountainAreas = Math.floor(width * height * density * 0.01);
    
    for (let i = 0; i < numMountainAreas; i++) {
      const mountainX = Math.floor(Math.random() * width);
      const mountainY = Math.floor(Math.random() * height);
      const mountainSize = Math.floor(Math.random() * 3) + 2;
      
      // Cria a área montanhosa
      for (let y = -mountainSize; y <= mountainSize; y++) {
        for (let x = -mountainSize; x <= mountainSize; x++) {
          const distance = Math.sqrt(x*x + y*y);
          if (distance <= mountainSize) {
            const tileX = mountainX + x;
            const tileY = mountainY + y;
            
            if (tileX >= 0 && tileX < width && tileY >= 0 && tileY < height) {
              tileManager.updateTile(tileX, tileY, {
                type: 'mountain',
                walkable: false,
                buildable: false
              });
            }
          }
        }
      }
    }
  }
  
  // Adiciona oásis ao deserto
  private addOases(terrain: TerrainManager): void {
    const { width, height } = terrain.getSize();
    const tileManager = terrain.getTileManager();
    const objectManager = terrain.getObjectManager();
    
    // Número de oásis
    const numOases = Math.floor(Math.sqrt(width * height) * 0.2);
    
    for (let i = 0; i < numOases; i++) {
      const oasisX = Math.floor(Math.random() * width);
      const oasisY = Math.floor(Math.random() * height);
      const oasisSize = Math.floor(Math.random() * 2) + 1;
      
      // Cria o oásis
      for (let y = -oasisSize; y <= oasisSize; y++) {
        for (let x = -oasisSize; x <= oasisSize; x++) {
          const distance = Math.sqrt(x*x + y*y);
          if (distance <= oasisSize) {
            const tileX = oasisX + x;
            const tileY = oasisY + y;
            
            if (tileX >= 0 && tileX < width && tileY >= 0 && tileY < height) {
              // Centro é água, borda é grama
              if (distance < oasisSize * 0.7) {
                tileManager.updateTile(tileX, tileY, {
                  type: 'water',
                  walkable: false,
                  buildable: false
                });
              } else {
                tileManager.updateTile(tileX, tileY, {
                  type: 'grass',
                  walkable: true,
                  buildable: true
                });
                
                // Adiciona árvores na borda do oásis
                if (Math.random() < 0.4 && !objectManager.hasObjectAt(tileX, tileY)) {
                  objectManager.addObject(tileX, tileY, GameObjectType.TREE_FRUIT);
                }
              }
            }
          }
        }
      }
    }
  }
}