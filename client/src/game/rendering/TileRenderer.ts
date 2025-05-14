/**
 * TileRenderer.ts
 * Responsável pela renderização de tiles no canvas
 */

import { cartesianToIsometric } from '../utils/isometric';
import { Tile } from '../tiles/TileManager';
import { TileType } from '../assets/tiles';
import { AssetManager } from '../config/AssetManager';
import { getTileAsset } from '../config/assets';

export class TileRenderer {
  private tileTypes: Record<string, TileType>;
  private tileSize: number;
  onLoad?: () => void;

  constructor(tileTypes: Record<string, TileType>, tileSize: number) {
    this.tileTypes = tileTypes;
    this.tileSize = tileSize;
  }

  // Desenha um tile usando cores (fallback se as imagens não estiverem disponíveis)
  private drawTileWithColor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    screenX: number,
    screenY: number,
    tile: Tile,
    isHovered: boolean = false
  ): void {
    const tileHalfSize = this.tileSize / 2;

    // Define os pontos do tile
    const points = [
      { x: screenX, y: screenY - tileHalfSize }, // topo
      { x: screenX + tileHalfSize, y: screenY }, // direita
      { x: screenX, y: screenY + tileHalfSize }, // baixo
      { x: screenX - tileHalfSize, y: screenY }, // esquerda
    ];

    // Desenha o fundo do tile
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();

    // Define a cor do tile baseado no tipo e no estado de hover
    const tileType = this.tileTypes[tile.type];

    if (isHovered) {
      ctx.fillStyle = "#e6f7ff"; // Cor de destaque para hover
    } else {
      ctx.fillStyle = tileType.color; // Cor padrão do tipo de tile
    }

    ctx.fill();

    // Desenha a borda do tile
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Desenha um tile usando a imagem correspondente
  private drawTileWithImage(
    ctx: CanvasRenderingContext2D,
    screenX: number,
    screenY: number,
    tile: Tile,
    isHovered: boolean = false
  ): void {
    const tileHalfSize = this.tileSize / 2;

    // Obtém a imagem para o tipo de tile do AssetManager
    const assetManager = AssetManager.getInstance();
    let img: HTMLImageElement | null = null;

    // Se tiver variant, tenta carregar a variante específica
    if (tile.variant) {
      const variantKey = `${tile.type}_${tile.variant}`;
      img = assetManager.getTileImage(variantKey);
    }

    // Se não tiver variante ou não encontrou a variante, tenta o tipo base
    if (!img) {
      img = assetManager.getTileImage(tile.type);
    }

    if (img && img.complete) {
      // Desenha a imagem do tile
      try {
        if (img && img.complete && img.naturalWidth !== 0) {
          ctx.drawImage(
            img,
            screenX - tileHalfSize,
            screenY - tileHalfSize,
            this.tileSize,
            this.tileSize
          );
        } else {
          // Desenha um placeholder se a imagem não carregou
          ctx.fillStyle = '#ccc';
          ctx.fillRect(screenX - tileHalfSize, screenY - tileHalfSize, this.tileSize, this.tileSize);
        }
      } catch (error) {
        console.error('Erro ao desenhar imagem:', error);
      }

      // Se estiver em hover, desenha um efeito de destaque
      if (isHovered) {
        ctx.fillStyle = "rgba(230, 247, 255, 0.3)"; // Destaque semi-transparente
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - tileHalfSize); // topo
        ctx.lineTo(screenX + tileHalfSize, screenY); // direita
        ctx.lineTo(screenX, screenY + tileHalfSize); // baixo
        ctx.lineTo(screenX - tileHalfSize, screenY); // esquerda
        ctx.closePath();
        ctx.fill();
      }
    } else {
      // Fallback para cores se a imagem não estiver disponível
      this.drawTileWithColor(ctx, tile.x, tile.y, screenX, screenY, tile, isHovered);
    }
  }

  // Renderiza um tile no canvas
  public renderTile(
    ctx: CanvasRenderingContext2D,
    tile: Tile,
    centerOffsetX: number,
    centerOffsetY: number,
    viewOffset: { x: number, y: number },
    isHovered: boolean = false
  ): void {
    const { x, y } = tile;
    const { x: isoX, y: isoY } = cartesianToIsometric(x, y);

    // Aplica o offset de visualização do arrasto
    const screenX = centerOffsetX + isoX * this.tileSize + viewOffset.x;
    const screenY = centerOffsetY + isoY * this.tileSize + viewOffset.y;

    // Verifica se o tile está fora da tela
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    if (
      screenX < -this.tileSize * 2 ||
      screenX > width + this.tileSize * 2 ||
      screenY < -this.tileSize * 2 ||
      screenY > height + this.tileSize * 2
    ) {
      return; // Não renderiza tiles fora da tela
    }

    // Verifica se o AssetManager está pronto
    const assetManager = AssetManager.getInstance();
    if (assetManager.isReady()) {
      // Se estiver pronto, usa as imagens
      this.drawTileWithImage(ctx, screenX, screenY, tile, isHovered);
      
      // Renderiza a estrutura se existir
      if (tile.structure) {
        const structureImage = assetManager.getStructureImage(tile.structure);
        if (structureImage && structureImage.complete) {
          const structureSize = this.tileSize * 1.2; // Estrutura um pouco maior que o tile
          // Ajusta o offset para centralizar a estrutura
          const offsetY = -structureSize * 0.2; // Ajuste vertical para melhor alinhamento isométrico
          ctx.drawImage(
            structureImage,
            screenX - structureSize/2,
            screenY - structureSize/2 + offsetY,
            structureSize,
            structureSize
          );
        }
      }
    } else {
      // Se não estiver pronto, usa as cores como fallback
      this.drawTileWithColor(ctx, x, y, screenX, screenY, tile, isHovered);
    }
  }
}