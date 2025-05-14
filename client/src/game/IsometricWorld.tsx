/**
 * IsometricWorld.tsx
 * Componente principal que renderiza o mundo isométrico usando a nova arquitetura
 */

import { useRef, useEffect, useState } from "react";
import { useGameWorld } from "./stores/useGameWorld";
import { isometricToCartesian } from "./utils/isometric";
import { toast } from "sonner";
import { IsometricRenderer, RenderConfig } from "./rendering/IsometricRenderer";
import { MapTheme } from "./MapGenerator";

const IsometricWorld: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<IsometricRenderer | null>(null);
  
  const {
    terrainManager,
    gridSize,
    tileSize,
    hoveredCell,
    setHoveredCell,
    selectedStructure,
    viewOffset,
    updateViewOffset,
    placeStructure,
    canPlaceStructure,
    initializeWorld
  } = useGameWorld();
  
  // Áudio é gerenciado pelo store
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializa o mundo do jogo
  useEffect(() => {
    if (!isInitialized) {
      initializeWorld();
      setIsInitialized(true);
    }
  }, [initializeWorld, isInitialized]);

  // Configura o canvas e manipula o redimensionamento
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        
        // Se o renderer já estiver criado, redimensiona-o
        if (rendererRef.current) {
          rendererRef.current.resize(canvas.width, canvas.height);
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Inicializa o renderer e configura a renderização
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !terrainManager) return;
    
    // Configuração inicial
    const renderConfig: RenderConfig = {
      tileSize,
      viewOffset,
      hoveredCell,
      selectedItem: selectedStructure
    };
    
    // Cria o renderer
    const renderer = new IsometricRenderer(canvas, terrainManager, renderConfig);
    rendererRef.current = renderer;
    
    // Função de renderização
    const renderWorld = () => {
      if (rendererRef.current) {
        // Atualiza a configuração antes de renderizar
        rendererRef.current.updateConfig({
          viewOffset,
          hoveredCell,
          selectedItem: selectedStructure
        });
        
        rendererRef.current.render();
      }
    };
    
    // Renderiza inicialmente
    renderWorld();
    
    // Configura loop de animação ou renderização sob demanda
    const animationLoop = () => {
      renderWorld();
      requestAnimationFrame(animationLoop);
    };
    
    // Inicia o loop de animação
    const animationFrameId = requestAnimationFrame(animationLoop);
    
    // Limpeza
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [terrainManager, tileSize, viewOffset, hoveredCell, selectedStructure]);

  // Manipula o movimento do mouse para atualizar a célula destacada
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerOffsetX = canvas.width / 2;
    const centerOffsetY = canvas.height / 3;

    // Se estiver arrastando a visualização
    if (isDragging) {
      const deltaX = mouseX - dragStart.x;
      const deltaY = mouseY - dragStart.y;
      
      const newOffset = {
        x: viewOffset.x + deltaX,
        y: viewOffset.y + deltaY
      };
      
      updateViewOffset(newOffset);
      setDragStart({ x: mouseX, y: mouseY });
      return;
    }

    // Converte coordenadas da tela para isométricas
    const isoX = (mouseX - centerOffsetX - viewOffset.x) / tileSize;
    const isoY = (mouseY - centerOffsetY - viewOffset.y) / tileSize;
    
    // Converte coordenadas isométricas para cartesianas
    const { x, y } = isometricToCartesian(isoX, isoY);
    
    // Verifica se está dentro dos limites do grid
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      setHoveredCell({ x: Math.floor(x), y: Math.floor(y) });
    } else {
      setHoveredCell(null);
    }
  };

  // Manipula a saída do mouse para limpar a célula destacada
  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  // Manipula o clique para colocar uma estrutura
  const handleClick = () => {
    if (hoveredCell && selectedStructure) {
      const { x, y } = hoveredCell;
      
      if (canPlaceStructure(x, y, selectedStructure)) {
        placeStructure(x, y, selectedStructure);
        // O som de sucesso será tocado diretamente no store para evitar problemas de hooks
        toast.success(`${selectedStructure} construído com sucesso!`);
      } else {
        toast.error("Não é possível construir aqui!");
      }
    }
  };

  // Manipula o clique com o botão direito do mouse para iniciar o arrasto
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 2 || e.button === 1) { // Clique direito ou do meio
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - canvasRef.current!.getBoundingClientRect().left,
        y: e.clientY - canvasRef.current!.getBoundingClientRect().top
      });
    }
  };

  // Manipula a liberação do mouse para finalizar o arrasto
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Previne o menu de contexto
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="relative w-full h-full bg-gray-900 overflow-hidden">
      <canvas
        ref={canvasRef}
        className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
      />
    </div>
  );
};

export default IsometricWorld;