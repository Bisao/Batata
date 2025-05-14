/**
 * ObjectRenderer.ts
 * Renderiza os objetos do jogo como árvores e rochas
 */

import { GameObject } from '../objects/GameObjects';
import { cartesianToIsometric } from '../utils/isometric';
import { AssetManager } from '../config/AssetManager';
import { getObjectAsset } from '../config/assets';

export class ObjectRenderer {
  private tileSize: number;

  constructor(tileSize: number) {
    this.tileSize = tileSize;
  }

  renderNPC(
    ctx: CanvasRenderingContext2D,
    npc: NPC,
    centerOffsetX: number,
    centerOffsetY: number,
    viewOffset: { x: number; y: number }
  ) {
    const { x, y } = npc.getPosition();
    const isoX = (x - y) * this.tileSize / 2;
    const isoY = (x + y) * this.tileSize / 4;
    
    const screenX = centerOffsetX + isoX + viewOffset.x;
    const screenY = centerOffsetY + isoY + viewOffset.y;

    // Desenha o círculo do NPC
    ctx.beginPath();
    ctx.arc(screenX, screenY - this.tileSize/3, this.tileSize/4, 0, Math.PI * 2);
    
    // Cor baseada na profissão
    switch(npc.data.profession) {
      case 'farmer':
        ctx.fillStyle = '#4CAF50'; // Verde
        break;
      case 'fisherman':
        ctx.fillStyle = '#2196F3'; // Azul
        break;
      case 'lumberjack':
        ctx.fillStyle = '#795548'; // Marrom
        break;
      case 'miner':
        ctx.fillStyle = '#607D8B'; // Cinza azulado
        break;
      default:
        ctx.fillStyle = '#9C27B0'; // Roxo
    }
    
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Renderiza um objeto no canvas
  public renderObject(
    ctx: CanvasRenderingContext2D,
    object: GameObject,
    centerOffsetX: number,
    centerOffsetY: number,
    viewOffset: { x: number, y: number }
  ): void {
    const { x, y, data, type, rotation = 0 } = object;
    const { scale = 1, offsetY = 0 } = data;
    
    // Converte coordenadas cartesianas para isométricas
    const { x: isoX, y: isoY } = cartesianToIsometric(x, y);
    
    // Aplica o offset de visualização
    const screenX = centerOffsetX + isoX * this.tileSize + viewOffset.x;
    const screenY = centerOffsetY + isoY * this.tileSize + viewOffset.y;

    // Verifica se o objeto está fora da tela para otimização
    const objectSize = this.tileSize * scale;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    if (
      screenX < -objectSize || 
      screenX > width + objectSize || 
      screenY < -objectSize || 
      screenY > height + objectSize
    ) {
      return; // Não renderiza objetos fora da tela
    }

    // Usa o AssetManager para obter a imagem do objeto
    const assetManager = AssetManager.getInstance();
    const img = assetManager.getObjectImage(type);
    
    if (img && img.complete) {
      ctx.save();
      
      // Translada para a posição do objeto
      ctx.translate(screenX, screenY + offsetY);
      
      // Aplica rotação automática baseada no tipo de objeto 
      // (para corrigir a orientação das árvores e outros objetos)
      let objRotation = rotation;
      
      // Na imagem referência, todas as árvores e pedras devem ter a mesma orientação
      // Zeramos a rotação para todos os tipos de árvores e pedras para manter consistência
      if (type.includes('tree') || type.includes('rock')) {
        objRotation = 0; // Todas as árvores e pedras com a mesma orientação
      }
      
      // Aplica rotação se necessário
      if (objRotation !== 0) {
        ctx.rotate((objRotation * Math.PI) / 180);
      }
      
      // Calcula o tamanho ajustado pela escala e tipo de objeto
      let width = this.tileSize * scale;
      let height = this.tileSize * scale;
      
      // Ajusta tamanho específico baseado no tipo
      if (type.includes('tree')) {
        // Baseado na imagem de referência, as árvores são equilibradas em proporção
        width = this.tileSize * scale * 1.0;
        height = this.tileSize * scale * 1.0;
      } else if (type.includes('rock')) {
        // Pedras também devem ser equilibradas em proporção para manter consistência
        width = this.tileSize * scale * 0.9;
        height = this.tileSize * scale * 0.9;
      }
      
      // Desenha a imagem centralizada
      ctx.drawImage(
        img,
        -width / 2,
        -height / 2,
        width,
        height
      );
      
      ctx.restore();
    } else {
      // Fallback se a imagem não estiver disponível - desenha um placeholder colorido
      this.drawObjectPlaceholder(ctx, screenX, screenY, object);
    }
  }

  // Desenha um placeholder para o objeto se a imagem não estiver disponível
  private drawObjectPlaceholder(
    ctx: CanvasRenderingContext2D,
    screenX: number,
    screenY: number,
    object: GameObject
  ): void {
    const { type } = object;
    const scale = object.data.scale || 1;
    const size = this.tileSize * scale * 0.7; // Tamanho do placeholder
    
    ctx.save();
    
    // Define cor base no tipo de objeto
    if (type.includes('tree')) {
      ctx.fillStyle = type.includes('autumn') ? '#D2691E' : '#228B22'; // Verde ou marrom alaranjado
    } else if (type.includes('rock')) {
      ctx.fillStyle = '#808080'; // Cinza
    } else {
      ctx.fillStyle = '#A9A9A9'; // Cinza escuro para outros objetos
    }
    
    // Desenha um círculo como placeholder
    ctx.beginPath();
    ctx.arc(screenX, screenY, size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Desenha a borda
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Adiciona um texto com o tipo de objeto
    ctx.fillStyle = '#FFF';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Pega apenas o nome do objeto sem o prefixo
    const objectName = type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    ctx.fillText(objectName, screenX, screenY);
    
    ctx.restore();
  }
}