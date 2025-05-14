/**
 * assets.ts
 * Configuração e gestão dos assets usados no jogo
 */

// Mapeamento dos tipos de tiles para suas imagens
export const TILE_ASSETS = {
  grass: '/assets/tiles/tile_grass.png',
  grass_2: '/assets/tiles/tile_grass_2.png',
  grass_3: '/assets/tiles/tile_grass_3.png',
  grass_flowers: '/assets/tiles/tile_grass_flowers.png',
  water: '/assets/tiles/tile_grass_2.png',  // Temporariamente usando grass_2
  mountain: '/assets/tiles/tile_grass.png', // Temporariamente usando grass
  sand: '/assets/tiles/tile_grass_3.png',   // Temporariamente usando grass_3
  forest: '/assets/tiles/tile_grass_flowers.png', // Temporariamente usando grass_flowers
  default: '/assets/tiles/tile_grass.png'
};

// Mapeamento dos tipos de estruturas para suas imagens
export const STRUCTURE_ASSETS = {
  // Estruturas originais
  house: '/assets/structures/house.png',
  factory: '/assets/structures/factory.png',
  farm: '/assets/structures/farm.png',
  tower: '/assets/structures/tower.png',

  // Novas estruturas
  water_well: '/public/assets/structures/WaterWell.png',
  windmill: '/public/assets/structures/Windmill.png',
  farmer_house: '/public/assets/structures/FarmerHouse.png',
  fisherman_house: '/public/assets/structures/FishermanHouse.png',
  lumberjack_house: '/public/assets/structures/LumberJackHouse.png',
  miner_house: '/public/assets/structures/MinerHouse.png',
  silo: '/public/assets/structures/Silo.png',

  default: '/assets/structures/house.png'
};

// Mapeamento dos objetos para suas imagens
export const OBJECT_ASSETS = {
  tree_simple: '/assets/objects/tree_simple.png',
  tree_pine: '/assets/objects/tree_pine.png',
  tree_fruit: '/assets/objects/tree_fruit.png',
  tree_autumn: '/assets/objects/tree_autumn.png',
  small_rock: '/assets/objects/small_rock.png',
  medium_rock: '/assets/objects/medium_rock.png',
  big_rock: '/assets/objects/big_rock.png',
  default: '/assets/objects/tree_simple.png'
};

// Função para obter o asset de um tile
export function getTileAsset(tileType: string): string {
  return TILE_ASSETS[tileType as keyof typeof TILE_ASSETS] || TILE_ASSETS.default;
}

// Função para obter o asset de uma estrutura
export function getStructureAsset(structureType: string): string {
  return STRUCTURE_ASSETS[structureType as keyof typeof STRUCTURE_ASSETS] || STRUCTURE_ASSETS.default;
}

// Função para obter o asset de um objeto
export function getObjectAsset(objectType: string): string {
  return OBJECT_ASSETS[objectType as keyof typeof OBJECT_ASSETS] || OBJECT_ASSETS.default;
}

// Função para carregar imagens de forma assíncrona
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn(`Não foi possível carregar a imagem: ${src}`);
      reject(new Error(`Falha ao carregar: ${src}`));
    };
    img.src = src;
  });
}

// Função para pré-carregar múltiplas imagens
export async function preloadAssets(
  assets: string[],
  onProgress?: (loaded: number, total: number) => void
): Promise<Map<string, HTMLImageElement>> {
  const imageMap = new Map<string, HTMLImageElement>();
  let loaded = 0;

  const loadPromises = assets.map(async (src) => {
    try {
      const img = await loadImage(src);
      imageMap.set(src, img);
      loaded++;

      if (onProgress) {
        onProgress(loaded, assets.length);
      }
    } catch (error) {
      console.error(`Erro ao carregar asset: ${src}`, error);
      // Não adicionamos ao map se falhar
    }
  });

  await Promise.allSettled(loadPromises);
  return imageMap;
}

// Conjunto de todos os assets para pré-carregamento
export function getAllAssetPaths(): string[] {
  return [
    ...Object.values(TILE_ASSETS),
    ...Object.values(STRUCTURE_ASSETS),
    ...Object.values(OBJECT_ASSETS)
  ].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicatas
}