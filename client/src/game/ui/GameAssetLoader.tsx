/**
 * GameAssetLoader.tsx
 * 
 * Componente responsável por carregar os assets do jogo
 * antes de renderizar os componentes que os utilizam
 */

import { useEffect, useState } from 'react';
import { AssetManager, AssetLoadingProgress } from '../config/AssetManager';

interface GameAssetLoaderProps {
  children: React.ReactNode;
  renderLoading?: (progress: AssetLoadingProgress) => React.ReactNode;
}

const GameAssetLoader: React.FC<GameAssetLoaderProps> = ({ 
  children, 
  renderLoading 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<AssetLoadingProgress>({
    loaded: 0, 
    total: 1, 
    percentage: 0
  });

  useEffect(() => {
    const assetManager = AssetManager.getInstance();
    
    // Registre o callback para atualizar o progresso
    assetManager.onProgress(setProgress);
    
    // Registre o callback para quando todos os assets estiverem carregados
    assetManager.onLoad(() => {
      setIsLoading(false);
    });
    
    // Inicie o carregamento
    assetManager.loadAllAssets().catch(error => {
      console.error("Erro ao carregar assets:", error);
      // Mesmo com erro, continuamos
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    // Se houver um renderizador personalizado, use-o
    if (renderLoading) {
      return <>{renderLoading(progress)}</>;
    }
    
    // Caso contrário, use a tela de carregamento padrão
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
        <div className="text-center p-6 bg-card rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold mb-4">
            Carregando Assets do Jogo
          </h2>
          
          <div className="w-64 h-3 bg-secondary rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          
          <p className="text-sm text-muted-foreground">
            {progress.loaded} de {progress.total} ({progress.percentage}%)
          </p>
        </div>
      </div>
    );
  }

  // Quando terminar o carregamento, renderize os filhos
  return <>{children}</>;
};

export default GameAssetLoader;