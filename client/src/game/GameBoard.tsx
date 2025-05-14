import { useRef, useEffect, useState } from "react";
import { useGameStore } from "./stores/useGameStore";
import { cartesianToIsometric, isometricToCartesian } from "./utils/isometric";
import { toast } from "sonner";
import { useAudio } from "@/lib/stores/useAudio";

const GameBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    gridSize,
    tileSize,
    grid,
    hoveredCell,
    setHoveredCell,
    selectedStructure,
    placeStructure,
    canPlaceStructure,
  } = useGameStore();
  
  const { playSuccess } = useAudio();
  const [isDragging, setIsDragging] = useState(false);
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Setup canvas and handle resizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        renderGrid();
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Re-render grid when necessary
  useEffect(() => {
    renderGrid();
  }, [grid, hoveredCell, viewOffset, selectedStructure]);

  // Render the isometric grid
  const renderGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate center offset to position the grid in the middle
    const centerOffsetX = width / 2;
    const centerOffsetY = height / 3;

    // Draw grid tiles
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const { x: isoX, y: isoY } = cartesianToIsometric(x, y);
        
        // Apply view offset from dragging
        const screenX = centerOffsetX + isoX * tileSize + viewOffset.x;
        const screenY = centerOffsetY + isoY * tileSize + viewOffset.y;

        // Skip tiles that are off screen
        if (
          screenX < -tileSize * 2 ||
          screenX > width + tileSize * 2 ||
          screenY < -tileSize * 2 ||
          screenY > height + tileSize * 2
        ) {
          continue;
        }

        // Draw the tile
        drawTile(ctx, x, y, screenX, screenY);
      }
    }

    // Draw structures on the grid
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const cell = grid[y][x];
        if (cell.structure) {
          const { x: isoX, y: isoY } = cartesianToIsometric(x, y);
          const screenX = centerOffsetX + isoX * tileSize + viewOffset.x;
          const screenY = centerOffsetY + isoY * tileSize + viewOffset.y;
          
          drawStructure(ctx, cell.structure, screenX, screenY);
        }
      }
    }

    // Draw placement preview if we have a selected structure and hoveredCell
    if (selectedStructure && hoveredCell) {
      const { x, y } = hoveredCell;
      const { x: isoX, y: isoY } = cartesianToIsometric(x, y);
      const screenX = centerOffsetX + isoX * tileSize + viewOffset.x;
      const screenY = centerOffsetY + isoY * tileSize + viewOffset.y;
      
      const canPlace = canPlaceStructure(x, y, selectedStructure);
      
      // Draw ghost preview of the structure
      drawStructurePreview(ctx, selectedStructure, screenX, screenY, canPlace);
    }
  };

  // Draw a single isometric tile
  const drawTile = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    screenX: number,
    screenY: number
  ) => {
    const tileHalfSize = tileSize / 2;
    
    // Define the tile points
    const points = [
      { x: screenX, y: screenY - tileHalfSize }, // top
      { x: screenX + tileHalfSize, y: screenY }, // right
      { x: screenX, y: screenY + tileHalfSize }, // bottom
      { x: screenX - tileHalfSize, y: screenY }, // left
    ];
    
    // Draw tile background
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    
    // Set tile color based on hover state
    const isHovered = hoveredCell && hoveredCell.x === x && hoveredCell.y === y;
    
    if (isHovered) {
      ctx.fillStyle = "#e6f7ff"; // Highlight color for hover
    } else {
      ctx.fillStyle = "#f0f0f0"; // Default tile color
    }
    
    ctx.fill();
    
    // Draw tile border
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw grid coordinates for debugging (optional)
    // ctx.fillStyle = "#999";
    // ctx.font = "8px Arial";
    // ctx.fillText(`${x},${y}`, screenX - 8, screenY + 3);
  };

  // Draw a structure on the tile
  const drawStructure = (
    ctx: CanvasRenderingContext2D,
    structureType: string,
    screenX: number,
    screenY: number
  ) => {
    const structureData = useGameStore.getState().structureTypes[structureType];
    if (!structureData) return;

    const size = tileSize * 0.8;
    
    ctx.save();
    
    // Style based on structure type
    switch (structureType) {
      case "house":
        // Draw house
        ctx.fillStyle = "#8B4513"; // brown
        
        // House base
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - size/3);
        ctx.lineTo(screenX + size/2, screenY);
        ctx.lineTo(screenX, screenY + size/3);
        ctx.lineTo(screenX - size/2, screenY);
        ctx.closePath();
        ctx.fill();
        
        // House roof
        ctx.fillStyle = "#A52A2A"; // dark red
        ctx.beginPath();
        ctx.moveTo(screenX - size/2, screenY);
        ctx.lineTo(screenX, screenY - size/3);
        ctx.lineTo(screenX + size/2, screenY);
        ctx.lineTo(screenX, screenY - size);
        ctx.closePath();
        ctx.fill();
        break;
        
      case "factory":
        // Draw factory
        ctx.fillStyle = "#708090"; // slate gray
        
        // Factory main building
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - size/2);
        ctx.lineTo(screenX + size/2, screenY - size/4);
        ctx.lineTo(screenX, screenY);
        ctx.lineTo(screenX - size/2, screenY - size/4);
        ctx.closePath();
        ctx.fill();
        
        // Factory chimney
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
        // Draw farm
        ctx.fillStyle = "#228B22"; // forest green
        
        // Farm field
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - size/3);
        ctx.lineTo(screenX + size/2, screenY);
        ctx.lineTo(screenX, screenY + size/3);
        ctx.lineTo(screenX - size/2, screenY);
        ctx.closePath();
        ctx.fill();
        
        // Farm rows
        ctx.strokeStyle = "#7CFC00"; // light green
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
        // Draw tower
        ctx.fillStyle = "#696969"; // dim gray
        
        // Tower base
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - size/4);
        ctx.lineTo(screenX + size/3, screenY);
        ctx.lineTo(screenX, screenY + size/4);
        ctx.lineTo(screenX - size/3, screenY);
        ctx.closePath();
        ctx.fill();
        
        // Tower body
        ctx.fillStyle = "#808080"; // gray
        ctx.beginPath();
        ctx.moveTo(screenX - size/4, screenY - size/3);
        ctx.lineTo(screenX + size/4, screenY - size/3);
        ctx.lineTo(screenX + size/4, screenY - size);
        ctx.lineTo(screenX - size/4, screenY - size);
        ctx.closePath();
        ctx.fill();
        
        // Tower top
        ctx.fillStyle = "#A9A9A9"; // dark gray
        ctx.beginPath();
        ctx.arc(screenX, screenY - size, size/5, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
    
    ctx.restore();
  };

  // Draw preview of structure placement
  const drawStructurePreview = (
    ctx: CanvasRenderingContext2D, 
    structureType: string, 
    screenX: number, 
    screenY: number,
    canPlace: boolean
  ) => {
    ctx.save();
    ctx.globalAlpha = 0.6;
    
    if (!canPlace) {
      // Red tint for invalid placement
      ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
      const tileHalfSize = tileSize / 2;
      
      ctx.beginPath();
      ctx.moveTo(screenX, screenY - tileHalfSize); // top
      ctx.lineTo(screenX + tileHalfSize, screenY); // right
      ctx.lineTo(screenX, screenY + tileHalfSize); // bottom
      ctx.lineTo(screenX - tileHalfSize, screenY); // left
      ctx.closePath();
      ctx.fill();
    }
    
    // Draw structure preview
    drawStructure(ctx, structureType, screenX, screenY);
    
    ctx.restore();
  };

  // Handle mouse move to update hovered cell
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerOffsetX = canvas.width / 2;
    const centerOffsetY = canvas.height / 3;

    // If dragging the view
    if (isDragging) {
      const deltaX = mouseX - dragStart.x;
      const deltaY = mouseY - dragStart.y;
      
      setViewOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setDragStart({ x: mouseX, y: mouseY });
      return;
    }

    // Convert screen coordinates back to isometric grid
    const isoX = (mouseX - centerOffsetX - viewOffset.x) / tileSize;
    const isoY = (mouseY - centerOffsetY - viewOffset.y) / tileSize;
    
    // Convert isometric coordinates to cartesian grid coordinates
    const { x, y } = isometricToCartesian(isoX, isoY);
    
    // Check if within grid bounds
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      setHoveredCell({ x: Math.floor(x), y: Math.floor(y) });
    } else {
      setHoveredCell(null);
    }
  };

  // Handle mouse leave to clear hovered cell
  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  // Handle click to place structure
  const handleClick = () => {
    if (hoveredCell && selectedStructure) {
      const { x, y } = hoveredCell;
      
      if (canPlaceStructure(x, y, selectedStructure)) {
        placeStructure(x, y, selectedStructure);
        playSuccess?.();
        toast.success(`${selectedStructure} placed successfully!`);
      } else {
        toast.error("Can't place structure here!");
      }
    }
  };

  // Handle right-click to start dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 2 || e.button === 1) { // Right-click or middle-click
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - canvasRef.current!.getBoundingClientRect().left,
        y: e.clientY - canvasRef.current!.getBoundingClientRect().top
      });
    }
  };

  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Prevent context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="relative w-full h-[calc(100vh-240px)] min-h-[500px] bg-gray-900 overflow-hidden">
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
      <div className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded-md text-sm">
        <p>Left click: Place structure | Right click + drag: Move view</p>
      </div>
    </div>
  );
};

export default GameBoard;
