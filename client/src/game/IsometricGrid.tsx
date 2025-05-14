import { useRef, useEffect } from "react";

interface IsometricGridProps {
  width: number;
  height: number;
  gridSize: number;
  tileSize: number;
}

/**
 * This component handles the rendering of the isometric grid backdrop.
 * It's used as a static background layer for the game.
 */
const IsometricGrid: React.FC<IsometricGridProps> = ({
  width,
  height,
  gridSize,
  tileSize,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate center offset
    const centerOffsetX = width / 2;
    const centerOffsetY = height / 3;

    // Draw the grid
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        // Convert grid coordinates to isometric
        const isoX = (x - y) * tileSize / 2;
        const isoY = (x + y) * tileSize / 4;

        // Draw a diamond shape
        const screenX = centerOffsetX + isoX;
        const screenY = centerOffsetY + isoY;

        drawTile(ctx, screenX, screenY, tileSize);
      }
    }
  }, [width, height, gridSize, tileSize]);

  // Draw a single isometric tile
  const drawTile = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) => {
    const halfSize = size / 2;

    ctx.beginPath();
    ctx.moveTo(x, y - halfSize / 2); // top
    ctx.lineTo(x + halfSize, y); // right
    ctx.lineTo(x, y + halfSize / 2); // bottom
    ctx.lineTo(x - halfSize, y); // left
    ctx.closePath();

    ctx.fillStyle = "#e0e0e0";
    ctx.fill();
    
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  return <canvas ref={canvasRef} className="w-full h-full absolute inset-0" />;
};

export default IsometricGrid;
