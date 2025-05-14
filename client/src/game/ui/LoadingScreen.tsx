/**
 * LoadingScreen.tsx
 * 
 * Tela de carregamento que mostra o progresso enquanto os assets são carregados
 */

import { useEffect, useState } from "react";
import { AssetManager, AssetLoadingProgress } from "../config/AssetManager";

interface LoadingScreenProps {
  onLoaded: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState<AssetLoadingProgress>({
    loaded: 0,
    total: 1,
    percentage: 0
  });
  
  useEffect(() => {
    const assetManager = AssetManager.getInstance();
    
    // Registra callbacks para progresso e conclusão
    assetManager.onProgress(setProgress);
    assetManager.onLoad(onLoaded);
    
    // Inicia o carregamento
    assetManager.loadAllAssets().catch(error => {
      console.error("Erro ao carregar assets:", error);
      // Mesmo com erro, continuamos para o jogo
      onLoaded();
    });
  }, [onLoaded]);
  
  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Carregando Jogo</h1>
        
        <div className="w-64 h-4 bg-gray-700 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        
        <p className="text-white">
          {progress.loaded} / {progress.total} recursos ({progress.percentage}%)
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;