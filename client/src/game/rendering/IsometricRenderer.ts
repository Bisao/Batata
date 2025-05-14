/**
 * IsometricRenderer.ts
 * Sistema principal de renderização isométrica que integra todos os elementos
 */

import { TerrainManager } from '../terrain/TerrainManager';
import { TileRenderer } from './TileRenderer';
import { ObjectRenderer } from './ObjectRenderer';
import { TILE_TYPES } from '../assets/tiles';
import { GAME_OBJECT_DATA, GameObjectType } from '../objects/GameObjects';
import { StructureType } from '../structures';
import { cartesianToIsometric } from '../utils/isometric';
import { AssetManager } from '../config/AssetManager';
import { getStructureAsset } from '../config/assets';

// Configuração para renderização
export interface RenderConfig {
  tileSize: number;
  viewOffset: { x: number, y: number };
  hoveredCell: { x: number, y: number } | null;
  selectedItem: StructureType | null;
}

export class IsometricRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tileRenderer: TileRenderer;
  private objectRenderer: ObjectRenderer;
  private terrainManager: TerrainManager;
  private config: RenderConfig;
  private imagesReady: boolean = false;

  constructor(canvas: HTMLCanvasElement, terrainManager: TerrainManager, config: RenderConfig) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.terrainManager = terrainManager;
    this.config = config;
    
    // Inicializa os renderers
    this.tileRenderer = new TileRenderer(TILE_TYPES, config.tileSize);
    this.objectRenderer = new ObjectRenderer(config.tileSize);
    
    // Preload de imagens
    this.preloadImages();
  }

  // Carrega todas as imagens necessárias usando o AssetManager centralizado
  private preloadImages(): void {
    // Usamos o AssetManager para lidar com o carregamento de imagens
    const assetManager = AssetManager.getInstance();
    
    // Se já estiver carregado, apenas marca como pronto
    if (assetManager.isReady()) {
      this.imagesReady = true;
      this.render();
      return;
    }
    
    // Registra um callback para quando os assets estiverem carregados
    assetManager.onLoad(() => {
      this.imagesReady = true;
      this.render(); // Renderiza assim que as imagens estiverem prontas
    });
    
    // Inicia o carregamento (se ainda não foi iniciado)
    assetManager.loadAllAssets().catch(error => {
      console.error("Erro ao carregar assets:", error);
      // Mesmo com erro, continuamos tentando renderizar
      this.imagesReady = true;
      this.render();
    });
  }

  // Atualiza a configuração de renderização
  updateConfig(newConfig: Partial<RenderConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Renderiza toda a cena isométrica
  render(): void {
    if (!this.ctx) return;
    
    const { width, height } = this.canvas;
    
    // Limpa o canvas
    this.ctx.clearRect(0, 0, width, height);
    
    // Calcula o offset central para posicionar o grid no meio
    const centerOffsetX = width / 2;
    const centerOffsetY = height / 3;
    
    // Renderiza tiles
    const tiles = this.terrainManager.getAllTiles();
    tiles.forEach(tile => {
      const isHovered = this.config.hoveredCell !== null && 
                        this.config.hoveredCell.x === tile.x && 
                        this.config.hoveredCell.y === tile.y;
      
      this.tileRenderer.renderTile(
        this.ctx,
        tile,
        centerOffsetX,
        centerOffsetY,
        this.config.viewOffset,
        isHovered
      );
    });
    
    // Renderiza objetos
    const objects = this.terrainManager.getObjectManager().getAllObjects();
    objects.forEach(object => {
      this.objectRenderer.renderObject(
        this.ctx,
        object,
        centerOffsetX,
        centerOffsetY,
        this.config.viewOffset
      );
    });
    
    // Renderiza NPCs
    const npcs = this.terrainManager.getNPCs();
    if (npcs) {
      npcs.forEach(npc => {
        this.objectRenderer.renderNPC(
          this.ctx,
          npc,
          centerOffsetX,
          centerOffsetY,
          this.config.viewOffset
        );
      });
    }

    // Renderiza preview de estrutura se houver
    this.renderStructurePreview(centerOffsetX, centerOffsetY);
  }

  // Renderiza preview da estrutura que está sendo posicionada
  private renderStructurePreview(centerOffsetX: number, centerOffsetY: number): void {
    const { hoveredCell, selectedItem } = this.config;
    
    if (!hoveredCell || !selectedItem) return;
    
    const { x, y } = hoveredCell;
    const { x: isoX, y: isoY } = cartesianToIsometric(x, y);
    const screenX = centerOffsetX + isoX * this.config.tileSize + this.config.viewOffset.x;
    const screenY = centerOffsetY + isoY * this.config.tileSize + this.config.viewOffset.y;
    
    // Verifica se pode colocar a estrutura nesta posição
    const canPlace = !this.terrainManager.isPositionOccupied(x, y);
    
    // Usa uma opacidade para indicar a preview
    this.ctx.save();
    this.ctx.globalAlpha = 0.6;
    
    if (!canPlace) {
      // Tint vermelho para colocação inválida
      this.ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
      const tileHalfSize = this.config.tileSize / 2;
      
      this.ctx.beginPath();
      this.ctx.moveTo(screenX, screenY - tileHalfSize);
      this.ctx.lineTo(screenX + tileHalfSize, screenY);
      this.ctx.lineTo(screenX, screenY + tileHalfSize);
      this.ctx.lineTo(screenX - tileHalfSize, screenY);
      this.ctx.closePath();
      this.ctx.fill();
    }
    
    // Desenha a estrutura preview (simplificado, deve ser expandido com a lógica real)
    this.drawStructurePreview(this.ctx, selectedItem, screenX, screenY);
    
    this.ctx.restore();
  }

  // Desenha o preview da estrutura
  private drawStructurePreview(
    ctx: CanvasRenderingContext2D,
    structureType: string,
    screenX: number,
    screenY: number
  ): void {
    const size = this.config.tileSize * 0.8;
    
    ctx.save();
    
    // Tenta usar a imagem da estrutura do AssetManager
    const assetManager = AssetManager.getInstance();
    const structureImage = assetManager.getStructureImage(structureType);
    
    if (structureImage && structureImage.complete) {
      // Se tiver uma imagem carregada, usa ela
      const imgWidth = size * 1.5;
      const imgHeight = size * 1.5;
      
      ctx.drawImage(
        structureImage,
        screenX - imgWidth / 2,
        screenY - imgHeight / 2,
        imgWidth,
        imgHeight
      );
    } else {
      // Fallback para desenho manual
      switch (structureType) {
        case "house":
          // Casa base
          ctx.fillStyle = "#8B4513"; // marrom
          ctx.beginPath();
          ctx.moveTo(screenX, screenY - size/3);
          ctx.lineTo(screenX + size/2, screenY);
          ctx.lineTo(screenX, screenY + size/3);
          ctx.lineTo(screenX - size/2, screenY);
          ctx.closePath();
          ctx.fill();
          
          // Telhado
          ctx.fillStyle = "#A52A2A"; // vermelho escuro
          ctx.beginPath();
          ctx.moveTo(screenX - size/2, screenY);
          ctx.lineTo(screenX, screenY - size/3);
          ctx.lineTo(screenX + size/2, screenY);
          ctx.lineTo(screenX, screenY - size);
          ctx.closePath();
          ctx.fill();
          break;
          
        case "factory":
          // Fábrica
          ctx.fillStyle = "#708090"; // cinza ardósia
          ctx.beginPath();
          ctx.moveTo(screenX, screenY - size/2);
          ctx.lineTo(screenX + size/2, screenY - size/4);
          ctx.lineTo(screenX, screenY);
          ctx.lineTo(screenX - size/2, screenY - size/4);
          ctx.closePath();
          ctx.fill();
          
          // Chaminé
          ctx.fillStyle = "#505050";
          ctx.beginPath();
          ctx.moveTo(screenX + size/4, screenY - size/2);
          ctx.lineTo(screenX + size/3, screenY - size/2);
          ctx.lineTo(screenX + size/3, screenY - size);
          ctx.lineTo(screenX + size/4, screenY - size);
          ctx.closePath();
          ctx.fill();
          break;
          
        case "farm":
          // Fazenda
          ctx.fillStyle = "#228B22"; // verde floresta
          ctx.beginPath();
          ctx.moveTo(screenX, screenY - size/3);
          ctx.lineTo(screenX + size/2, screenY);
          ctx.lineTo(screenX, screenY + size/3);
          ctx.lineTo(screenX - size/2, screenY);
          ctx.closePath();
          ctx.fill();
          
          // Linhas de cultivo
          ctx.strokeStyle = "#7CFC00"; // verde claro
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(screenX - size/3, screenY);
          ctx.lineTo(screenX + size/3, screenY);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(screenX, screenY - size/4);
          ctx.lineTo(screenX, screenY + size/4);
          ctx.stroke();
          break;
          
        case "tower":
          // Torre base
          ctx.fillStyle = "#696969"; // cinza escuro
          ctx.beginPath();
          ctx.moveTo(screenX, screenY - size/4);
          ctx.lineTo(screenX + size/3, screenY);
          ctx.lineTo(screenX, screenY + size/4);
          ctx.lineTo(screenX - size/3, screenY);
          ctx.closePath();
          ctx.fill();
          
          // Corpo da torre
          ctx.fillStyle = "#808080"; // cinza
          ctx.beginPath();
          ctx.moveTo(screenX - size/4, screenY - size/3);
          ctx.lineTo(screenX + size/4, screenY - size/3);
          ctx.lineTo(screenX + size/4, screenY - size);
          ctx.lineTo(screenX - size/4, screenY - size);
          ctx.closePath();
          ctx.fill();
          
          // Topo da torre
          ctx.fillStyle = "#A9A9A9"; // cinza escuro
          ctx.beginPath();
          ctx.arc(screenX, screenY - size, size/5, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        default:
          // Generic placeholder
          ctx.fillStyle = "rgba(100, 100, 255, 0.5)";
          ctx.beginPath();
          ctx.moveTo(screenX, screenY - size/2);
          ctx.lineTo(screenX + size/2, screenY);
          ctx.lineTo(screenX, screenY + size/2);
          ctx.lineTo(screenX - size/2, screenY);
          ctx.closePath();
          ctx.fill();
          
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 1;
          ctx.stroke();
      }
    }
    
    ctx.restore();
  }

  // Redimensiona o canvas
  resize(width: number, height: number): void {
    if (this.canvas) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.render();
    }
  }

  // Verifica se todas as imagens estão carregadas
  isReady(): boolean {
    return this.imagesReady;
  }
}