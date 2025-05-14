/**
 * GameObjects.ts
 * Define os objetos do jogo como árvores e rochas
 */

// Tipos de objetos disponíveis no jogo
export enum GameObjectType {
  TREE_SIMPLE = 'tree_simple',
  TREE_PINE = 'tree_pine',
  TREE_FRUIT = 'tree_fruit',
  TREE_AUTUMN = 'tree_autumn',
  ROCK_SMALL = 'small_rock',
  ROCK_MEDIUM = 'medium_rock',
  ROCK_BIG = 'big_rock',
}

// Dados de cada tipo de objeto
export interface GameObjectData {
  id: string;
  name: string;
  description: string;
  blocksMovement: boolean;
  blocksBuild: boolean;
  sprite: string; // Caminho para a imagem
  offsetY?: number; // Deslocamento vertical para ajuste visual
  scale?: number; // Escala do objeto (1.0 = tamanho normal)
  hasCollision?: boolean; // Se o objeto tem colisão física
}

// Definição de um objeto colocado no mundo
export interface GameObject {
  id: string;
  type: GameObjectType;
  x: number;
  y: number;
  rotation?: number; // Rotação em graus
  data: GameObjectData;
}

// Mapeamento de tipos de objetos para seus dados
export const GAME_OBJECT_DATA: Record<GameObjectType, GameObjectData> = {
  [GameObjectType.TREE_SIMPLE]: {
    id: GameObjectType.TREE_SIMPLE,
    name: "Árvore Simples",
    description: "Uma árvore comum com folhas verdes",
    blocksMovement: true,
    blocksBuild: true,
    sprite: "/assets/objects/tree_simple.png",
    offsetY: -20, // Árvores precisam de offset para parecer que estão no chão
    scale: 1.0,
    hasCollision: true
  },
  [GameObjectType.TREE_PINE]: {
    id: GameObjectType.TREE_PINE,
    name: "Pinheiro",
    description: "Um pinheiro alto e cônico",
    blocksMovement: true,
    blocksBuild: true,
    sprite: "/assets/objects/tree_pine.png",
    offsetY: -25,
    scale: 1.2,
    hasCollision: true
  },
  [GameObjectType.TREE_FRUIT]: {
    id: GameObjectType.TREE_FRUIT,
    name: "Árvore Frutífera",
    description: "Uma árvore que produz frutas",
    blocksMovement: true,
    blocksBuild: true,
    sprite: "/assets/objects/tree_fruit.png",
    offsetY: -20,
    scale: 1.0,
    hasCollision: true
  },
  [GameObjectType.TREE_AUTUMN]: {
    id: GameObjectType.TREE_AUTUMN,
    name: "Árvore Outonal",
    description: "Uma árvore com folhas alaranjadas de outono",
    blocksMovement: true,
    blocksBuild: true,
    sprite: "/assets/objects/tree_autumn.png",
    offsetY: -20,
    scale: 1.0,
    hasCollision: true
  },
  [GameObjectType.ROCK_SMALL]: {
    id: GameObjectType.ROCK_SMALL,
    name: "Pedra Pequena",
    description: "Uma pequena pedra",
    blocksMovement: false,
    blocksBuild: false,
    sprite: "/assets/objects/small_rock.png",
    scale: 0.8,
    hasCollision: false
  },
  [GameObjectType.ROCK_MEDIUM]: {
    id: GameObjectType.ROCK_MEDIUM,
    name: "Pedra Média",
    description: "Uma pedra de tamanho médio",
    blocksMovement: true,
    blocksBuild: true,
    sprite: "/assets/objects/medium_rock.png",
    scale: 1.0,
    hasCollision: true
  },
  [GameObjectType.ROCK_BIG]: {
    id: GameObjectType.ROCK_BIG,
    name: "Pedra Grande",
    description: "Uma grande rocha",
    blocksMovement: true,
    blocksBuild: true,
    sprite: "/assets/objects/big_rock.png",
    offsetY: -10,
    scale: 1.2,
    hasCollision: true
  },
};