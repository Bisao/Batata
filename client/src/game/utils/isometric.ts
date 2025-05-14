/**
 * Utility functions for converting between cartesian and isometric coordinates
 */

// Convert cartesian (grid) coordinates to isometric coordinates
export function cartesianToIsometric(x: number, y: number) {
  return {
    x: x - y,
    y: (x + y) / 2
  };
}

// Convert isometric coordinates back to cartesian (grid) coordinates
export function isometricToCartesian(isoX: number, isoY: number) {
  return {
    x: (2 * isoY + isoX) / 2,
    y: (2 * isoY - isoX) / 2
  };
}

// Check if two points are adjacent in the grid
export function arePointsAdjacent(x1: number, y1: number, x2: number, y2: number): boolean {
  // Two points are adjacent if they differ by at most 1 in either x or y
  const xDiff = Math.abs(x1 - x2);
  const yDiff = Math.abs(y1 - y2);
  
  return (xDiff <= 1 && yDiff <= 1) && (xDiff + yDiff > 0);
}

// Calculate distance between two grid points
export function gridDistance(x1: number, y1: number, x2: number, y2: number): number {
  // In a grid, we can use Manhattan distance
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}
