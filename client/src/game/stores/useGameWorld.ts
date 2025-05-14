/**
 * useGameWorld.ts
 * Store central para o gerenciamento do mundo do jogo usando a nova arquitetura modular
 */

import { create } from "zustand";
import { TerrainManager } from "../terrain/TerrainManager";
import { MapGenerator, MapTheme } from "../MapGenerator";
import { STRUCTURE_TYPES, type StructureType } from "../structures/index";
import { NPCManager } from "../npc/NPCManager";
import { NPC } from "../npc/NPC";
import { NPCState, NPCProfession, type NPCData } from "../npc/NPCTypes";
import { useAudio } from "@/lib/stores/useAudio";

interface GameWorldState {
  // Propriedades do mundo
  terrainManager: TerrainManager | null;
  gridSize: number;
  tileSize: number;
  resources: number;
  
  // Estado da UI
  hoveredCell: { x: number; y: number } | null;
  selectedStructure: StructureType | null;
  viewOffset: { x: number; y: number };
  
  // Dados estáticos
  structureTypes: typeof STRUCTURE_TYPES;
  
  // Ações
  initializeWorld: (theme?: MapTheme) => void;
  selectStructure: (structureType: StructureType | null) => void;
  placeStructure: (x: number, y: number, structureType: StructureType) => void;
  removeStructure: (x: number, y: number) => void;
  setHoveredCell: (cell: { x: number; y: number } | null) => void;
  updateViewOffset: (offset: { x: number; y: number }) => void;
  canPlaceStructure: (x: number, y: number, structureType: StructureType) => boolean;
}

export const useGameWorld = create<GameWorldState>((set, get) => ({
  // Estado inicial
  terrainManager: null,
  gridSize: 20,
  tileSize: 64,
  resources: 1000,
  hoveredCell: null,
  selectedStructure: null,
  viewOffset: { x: 0, y: 0 },
  structureTypes: STRUCTURE_TYPES,
  
  // Inicializa o mundo do jogo
  initializeWorld: (theme = MapTheme.DEFAULT) => {
    const gridSize = get().gridSize;
    
    // Cria um gerador de mapa com o tema especificado
    const mapGenerator = new MapGenerator({
      width: gridSize,
      height: gridSize,
      theme
    });
    
    // Gera o terreno com objetos
    const terrainManager = mapGenerator.generate();
    
    set({ 
      terrainManager,
      viewOffset: { x: 0, y: 0 },
      resources: 1000
    });
  },
  
  // Seleciona uma estrutura para construção
  selectStructure: (structureType) => {
    set({ selectedStructure: structureType });
  },
  
  // Coloca uma estrutura no mundo
  placeStructure: (x, y, structureType) => {
    const { terrainManager, resources, structureTypes } = get();
    if (!terrainManager) return;
    
    // Verifica se temos recursos suficientes
    const cost = structureTypes[structureType].cost;
    if (resources < cost) {
      console.log("Recursos insuficientes!");
      return;
    }
    
    // Verifica se podemos construir aqui
    if (!get().canPlaceStructure(x, y, structureType)) {
      console.log("Não é possível construir aqui!");
      return;
    }
    
    // Obtém os gerenciadores
    const tileManager = terrainManager.getTileManager();
    
    // Atualiza o tile para indicar que há uma estrutura
    tileManager.updateTile(x, y, {
      buildable: false,
      walkable: !structureTypes[structureType].blocksMovement,
      structure: structureType // Adiciona a estrutura ao tile
    });
    
    // Tenta reproduzir o som de sucesso
    try {
      const audioState = useAudio.getState();
      if (audioState && audioState.playSuccess) {
        audioState.playSuccess();
      }
    } catch (e) {
      console.log("Não foi possível reproduzir o som");
    }
    
    // Cria NPC baseado no tipo de estrutura
    if (structureType.includes('_house')) {
      const profession = structureType.replace('_house', '').toLowerCase();
      const homeId = `house_${x}_${y}_${Date.now()}`; // ID único para a casa
      
      const npcData: NPCData = {
        id: `npc_${Date.now()}`,
        name: `${profession.charAt(0).toUpperCase() + profession.slice(1)}`,
        state: NPCState.IDLE,
        profession: profession as NPCProfession,
        x: x,
        y: y,
        speed: 1,
        homeId: homeId
      };
      
      const npc = terrainManager.createNPC(npcData);
      terrainManager.getNPCManager().updateNPCs(0); // Inicializa o NPC
    }
    
    // Atualiza recursos
    set({ resources: resources - cost });
  },
  
  // Remove uma estrutura do mundo
  removeStructure: (x, y) => {
    const { terrainManager } = get();
    if (!terrainManager) return;
    
    const tileManager = terrainManager.getTileManager();
    const tile = tileManager.getTile(x, y);
    
    if (tile) {
      // Restaura as propriedades originais do tile
      tileManager.updateTile(x, y, {
        buildable: true,
        walkable: true
      });
    }
  },
  
  // Atualiza a célula destacada (hover)
  setHoveredCell: (cell) => {
    set({ hoveredCell: cell });
  },
  
  // Atualiza o offset de visualização (para pan/zoom)
  updateViewOffset: (offset) => {
    set({ viewOffset: offset });
  },
  
  // Verifica se uma estrutura pode ser colocada em uma coordenada
  canPlaceStructure: (x, y, structureType) => {
    const { terrainManager, gridSize } = get();
    if (!terrainManager) return false;
    
    // Verifica limites do mapa
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
      return false;
    }
    
    // Verifica se o terreno permite construção
    return !terrainManager.isPositionOccupied(x, y);
  }
}));