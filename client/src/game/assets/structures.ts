/**
 * Provides helper functions for rendering structures
 */

// Defines the colors for rendering different structure types
export const STRUCTURE_COLORS = {
  house: {
    base: "#8B4513", // brown
    roof: "#A52A2A", // dark red
    accent: "#D2B48C", // tan
  },
  
  factory: {
    base: "#708090", // slate gray
    roof: "#505050", // dark gray
    accent: "#A9A9A9", // medium gray
  },
  
  farm: {
    base: "#228B22", // forest green
    fence: "#8B4513", // brown
    crop: "#7CFC00", // light green
  },
  
  tower: {
    base: "#696969", // dim gray
    top: "#A9A9A9", // dark gray
    window: "#000000", // black
  }
};

/**
 * Draw a house on the isometric grid
 */
export function drawHouse(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  const colors = STRUCTURE_COLORS.house;
  
  // House base
  ctx.fillStyle = colors.base;
  ctx.beginPath();
  ctx.moveTo(x, y - size/3);
  ctx.lineTo(x + size/2, y);
  ctx.lineTo(x, y + size/3);
  ctx.lineTo(x - size/2, y);
  ctx.closePath();
  ctx.fill();
  
  // House roof
  ctx.fillStyle = colors.roof;
  ctx.beginPath();
  ctx.moveTo(x - size/2, y);
  ctx.lineTo(x, y - size/3);
  ctx.lineTo(x + size/2, y);
  ctx.lineTo(x, y - size);
  ctx.closePath();
  ctx.fill();
  
  // Window
  ctx.fillStyle = colors.accent;
  ctx.fillRect(x - size/6, y - size/6, size/8, size/8);
}

/**
 * Draw a factory on the isometric grid
 */
export function drawFactory(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  const colors = STRUCTURE_COLORS.factory;
  
  // Factory main building
  ctx.fillStyle = colors.base;
  ctx.beginPath();
  ctx.moveTo(x, y - size/2);
  ctx.lineTo(x + size/2, y - size/4);
  ctx.lineTo(x, y);
  ctx.lineTo(x - size/2, y - size/4);
  ctx.closePath();
  ctx.fill();
  
  // Factory chimney
  ctx.fillStyle = colors.roof;
  ctx.beginPath();
  ctx.moveTo(x + size/4, y - size/2);
  ctx.lineTo(x + size/3, y - size/2);
  ctx.lineTo(x + size/3, y - size);
  ctx.lineTo(x + size/4, y - size);
  ctx.closePath();
  ctx.fill();
}

/**
 * Draw a farm on the isometric grid
 */
export function drawFarm(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  const colors = STRUCTURE_COLORS.farm;
  
  // Farm field
  ctx.fillStyle = colors.base;
  ctx.beginPath();
  ctx.moveTo(x, y - size/3);
  ctx.lineTo(x + size/2, y);
  ctx.lineTo(x, y + size/3);
  ctx.lineTo(x - size/2, y);
  ctx.closePath();
  ctx.fill();
  
  // Farm rows
  ctx.strokeStyle = colors.crop;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - size/3, y);
  ctx.lineTo(x + size/3, y);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(x, y - size/4);
  ctx.lineTo(x, y + size/4);
  ctx.stroke();
}

/**
 * Draw a tower on the isometric grid
 */
export function drawTower(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  const colors = STRUCTURE_COLORS.tower;
  
  // Tower base
  ctx.fillStyle = colors.base;
  ctx.beginPath();
  ctx.moveTo(x, y - size/4);
  ctx.lineTo(x + size/3, y);
  ctx.lineTo(x, y + size/4);
  ctx.lineTo(x - size/3, y);
  ctx.closePath();
  ctx.fill();
  
  // Tower body
  ctx.fillStyle = colors.base;
  ctx.beginPath();
  ctx.moveTo(x - size/4, y - size/3);
  ctx.lineTo(x + size/4, y - size/3);
  ctx.lineTo(x + size/4, y - size);
  ctx.lineTo(x - size/4, y - size);
  ctx.closePath();
  ctx.fill();
  
  // Tower top
  ctx.fillStyle = colors.top;
  ctx.beginPath();
  ctx.arc(x, y - size, size/5, 0, Math.PI * 2);
  ctx.fill();
}
