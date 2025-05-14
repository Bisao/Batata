/**
 * ObjectManager.ts
 * Gerencia os objetos do jogo como árvores e rochas
 */

import { GameObject, GameObjectType, GAME_OBJECT_DATA } from './GameObjects';

export class ObjectManager {
  private objects: Map<string, GameObject> = new Map();
  private lastId: number = 0;

  constructor() {}

  // Adiciona um novo objeto ao mundo
  addObject(x: number, y: number, type: GameObjectType, rotation: number = 0): GameObject {
    const objectData = GAME_OBJECT_DATA[type];
    if (!objectData) {
      throw new Error(`Tipo de objeto desconhecido: ${type}`);
    }

    const id = `obj_${++this.lastId}`;
    const gameObject: GameObject = {
      id,
      type,
      x,
      y,
      rotation,
      data: objectData
    };

    this.objects.set(id, gameObject);
    return gameObject;
  }

  // Remove um objeto pelo ID
  removeObject(id: string): boolean {
    return this.objects.delete(id);
  }

  // Remove um objeto pela posição
  removeObjectAt(x: number, y: number): boolean {
    const object = this.getObjectAt(x, y);
    if (object) {
      return this.removeObject(object.id);
    }
    return false;
  }

  // Obtém um objeto pelo ID
  getObject(id: string): GameObject | undefined {
    return this.objects.get(id);
  }

  // Obtém um objeto pela posição
  getObjectAt(x: number, y: number): GameObject | undefined {
    // Converte para array antes de iterar para evitar problemas de tipagem
    const objectsArray = Array.from(this.objects.values());
    for (const object of objectsArray) {
      if (object.x === x && object.y === y) {
        return object;
      }
    }
    return undefined;
  }

  // Verifica se existe objeto em uma posição
  hasObjectAt(x: number, y: number): boolean {
    return !!this.getObjectAt(x, y);
  }

  // Verifica se uma posição está bloqueada para movimento
  isPositionBlockedForMovement(x: number, y: number): boolean {
    const object = this.getObjectAt(x, y);
    return object ? object.data.blocksMovement : false;
  }

  // Verifica se uma posição está bloqueada para construção
  isPositionBlockedForBuilding(x: number, y: number): boolean {
    const object = this.getObjectAt(x, y);
    return object ? object.data.blocksBuild : false;
  }

  // Obtém todos os objetos
  getAllObjects(): GameObject[] {
    return Array.from(this.objects.values());
  }

  // Obtém todos os objetos de um determinado tipo
  getObjectsByType(type: GameObjectType): GameObject[] {
    return this.getAllObjects().filter(obj => obj.type === type);
  }
}