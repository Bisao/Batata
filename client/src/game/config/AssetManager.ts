/**
 * AssetManager.ts
 * 
 * Gerenciador centralizado para lidar com o carregamento e acesso aos recursos do jogo
 */

import { 
  getAllAssetPaths, 
  preloadAssets, 
  getTileAsset, 
  getStructureAsset, 
  getObjectAsset 
} from './assets';

export interface AssetLoadingProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class AssetManager {
  private static instance: AssetManager;
  private loadedAssets: Map<string, HTMLImageElement> = new Map();
  private isLoaded: boolean = false;
  private onProgressCallbacks: ((progress: AssetLoadingProgress) => void)[] = [];
  private onLoadCallbacks: (() => void)[] = [];
  
  // Construtor privado (Singleton)
  private constructor() {}
  
  // Obtém a instância do gerenciador
  public static getInstance(): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance = new AssetManager();
    }
    return AssetManager.instance;
  }
  
  // Inicia o carregamento de todos os assets
  public async loadAllAssets(): Promise<void> {
    if (this.isLoaded) return;
    
    const assetPaths = getAllAssetPaths();
    
    try {
      this.loadedAssets = await preloadAssets(
        assetPaths,
        (loaded, total) => {
          const progress: AssetLoadingProgress = {
            loaded,
            total,
            percentage: Math.floor((loaded / total) * 100)
          };
          
          this.notifyProgress(progress);
        }
      );
      
      this.isLoaded = true;
      this.notifyLoaded();
    } catch (error) {
      console.error('Erro ao carregar assets:', error);
      // Continua mesmo se houver erros, para usar os fallbacks
      this.isLoaded = true;
      this.notifyLoaded();
    }
  }
  
  // Verifica se todos os assets estão carregados
  public isReady(): boolean {
    return this.isLoaded;
  }
  
  // Obtém uma imagem carregada
  public getImage(path: string): HTMLImageElement | null {
    return this.loadedAssets.get(path) || null;
  }
  
  // Obtém uma imagem de tile
  public getTileImage(tileType: string): HTMLImageElement | null {
    const assetPath = getTileAsset(tileType);
    return this.getImage(assetPath);
  }
  
  // Obtém uma imagem de estrutura
  public getStructureImage(structureType: string): HTMLImageElement | null {
    const assetPath = getStructureAsset(structureType);
    return this.getImage(assetPath);
  }
  
  // Obtém uma imagem de objeto
  public getObjectImage(objectType: string): HTMLImageElement | null {
    const assetPath = getObjectAsset(objectType);
    return this.getImage(assetPath);
  }
  
  // Registra um callback para o progresso de carregamento
  public onProgress(callback: (progress: AssetLoadingProgress) => void): void {
    this.onProgressCallbacks.push(callback);
  }
  
  // Registra um callback para quando todos os assets forem carregados
  public onLoad(callback: () => void): void {
    if (this.isLoaded) {
      callback();
    } else {
      this.onLoadCallbacks.push(callback);
    }
  }
  
  // Notifica todos os callbacks de progresso
  private notifyProgress(progress: AssetLoadingProgress): void {
    this.onProgressCallbacks.forEach(callback => callback(progress));
  }
  
  // Notifica todos os callbacks de carregamento completo
  private notifyLoaded(): void {
    this.onLoadCallbacks.forEach(callback => callback());
    // Limpa os callbacks depois de notificar
    this.onLoadCallbacks = [];
  }
}