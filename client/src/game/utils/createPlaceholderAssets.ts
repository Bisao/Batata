/**
 * createPlaceholderAssets.ts
 * 
 * Utilitário para criar assets de placeholder como SVGs
 * Isso nos permite trabalhar com a estrutura do jogo até termos os assets reais
 */

import { GameObjectType } from "../objects/GameObjects";

interface AssetDefinition {
  name: string;
  path: string;
  content: string;
  width: number;
  height: number;
}

// Cria SVGs simples para os tiles
export function createTilePlaceholders(): AssetDefinition[] {
  const tileTypes = ['grass', 'water', 'mountain', 'sand', 'forest'];
  const tileColors = {
    grass: '#7cba5d',
    water: '#5d95ba',
    mountain: '#a1a1a1',
    sand: '#e8db84',
    forest: '#3e7943',
  };
  
  const assets: AssetDefinition[] = [];
  
  // Cria uma versão básica para cada tipo de tile
  tileTypes.forEach(type => {
    const color = tileColors[type as keyof typeof tileColors] || '#a1a1a1';
    
    assets.push({
      name: `tile_${type}`,
      path: `/assets/tiles/tile_${type}.svg`,
      content: createTileSVG(color),
      width: 64,
      height: 64
    });
    
    // Para grama, cria algumas variantes
    if (type === 'grass') {
      for (let i = 1; i <= 3; i++) {
        assets.push({
          name: `tile_${type}_${i}`,
          path: `/assets/tiles/tile_${type}_${i}.svg`,
          content: createTileSVG(color, i),
          width: 64,
          height: 64
        });
      }
    }
  });
  
  return assets;
}

// Cria SVGs para os objetos (árvores, rochas, etc)
export function createObjectPlaceholders(): AssetDefinition[] {
  const assets: AssetDefinition[] = [];
  
  // Árvores
  const treeTypes = [
    { type: GameObjectType.TREE_SIMPLE, color: '#118833' },
    { type: GameObjectType.TREE_PINE, color: '#005522' },
    { type: GameObjectType.TREE_FRUIT, color: '#22aa44' },
    { type: GameObjectType.TREE_AUTUMN, color: '#dd6611' }
  ];
  
  treeTypes.forEach(tree => {
    assets.push({
      name: tree.type,
      path: `/assets/objects/${tree.type}.svg`,
      content: createTreeSVG(tree.color),
      width: 64,
      height: 96
    });
  });
  
  // Rochas
  const rockTypes = [
    { type: GameObjectType.ROCK_SMALL, color: '#aaaaaa', size: 0.6 },
    { type: GameObjectType.ROCK_MEDIUM, color: '#888888', size: 0.8 },
    { type: GameObjectType.ROCK_BIG, color: '#666666', size: 1.0 }
  ];
  
  rockTypes.forEach(rock => {
    assets.push({
      name: rock.type,
      path: `/assets/objects/${rock.type}.svg`,
      content: createRockSVG(rock.color, rock.size),
      width: 64,
      height: 64
    });
  });
  
  return assets;
}

// Cria um SVG básico para um tile isométrico
function createTileSVG(color: string, variant: number = 0): string {
  // Adiciona detalhes dependendo da variante
  let details = '';
  
  if (variant > 0) {
    // Adiciona grama ou detalhes
    const detailColor = adjustColor(color, 10);
    
    if (variant === 1) {
      // Algumas linhas de grama
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * 60 - 30;
        const y = Math.random() * 60 - 30;
        details += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y-5}" stroke="${detailColor}" stroke-width="1" />`;
      }
    } else if (variant === 2) {
      // Pequenos círculos
      for (let i = 0; i < 3; i++) {
        const x = Math.random() * 50 - 25;
        const y = Math.random() * 50 - 25;
        const r = 1 + Math.random() * 2;
        details += `<circle cx="${x}" cy="${y}" r="${r}" fill="${detailColor}" />`;
      }
    } else if (variant === 3) {
      // Pequenos arbustos
      for (let i = 0; i < 2; i++) {
        const x = Math.random() * 50 - 25;
        const y = Math.random() * 50 - 25;
        details += `
          <circle cx="${x}" cy="${y}" r="3" fill="${detailColor}" />
          <circle cx="${x-2}" cy="${y-1}" r="2" fill="${detailColor}" />
          <circle cx="${x+2}" cy="${y-1}" r="2" fill="${detailColor}" />
        `;
      }
    }
  }
  
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-32 -32 64 64" width="64" height="64">
      <polygon points="0,-32 32,0 0,32 -32,0" fill="${color}" stroke="#aaa" stroke-width="1" />
      ${details}
    </svg>
  `;
}

// Cria um SVG para uma árvore
function createTreeSVG(color: string): string {
  const trunkColor = '#8B4513'; // Marrom
  const trunkWidth = 8;
  const trunkHeight = 20;
  
  // Cria a copa da árvore (parte verde)
  const canopyLayers = 3;
  let canopy = '';
  
  for (let i = 0; i < canopyLayers; i++) {
    const y = -(i * 15) - 20;
    const width = 30 - i * 4;
    canopy += `
      <polygon 
        points="0,${y} ${width},${y+width/2} 0,${y+width} ${-width},${y+width/2}" 
        fill="${adjustColor(color, -i*5)}"
        stroke="#006600"
        stroke-width="0.5"
      />
    `;
  }
  
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-32 -80 64 96" width="64" height="96">
      <!-- Tronco -->
      <rect x="${-trunkWidth/2}" y="-${trunkHeight}" width="${trunkWidth}" height="${trunkHeight}" fill="${trunkColor}" />
      
      <!-- Copa -->
      ${canopy}
    </svg>
  `;
}

// Cria um SVG para uma rocha
function createRockSVG(color: string, sizeMultiplier: number = 1.0): string {
  const size = 24 * sizeMultiplier;
  
  // Cria um polígono irregular para a rocha
  const points = [];
  const numPoints = 8;
  
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const radius = size * (0.8 + Math.random() * 0.4);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    points.push(`${x},${y}`);
  }
  
  const borderColor = adjustColor(color, -20);
  const highlightColor = adjustColor(color, 20);
  
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-32 -32 64 64" width="64" height="64">
      <!-- Sombra -->
      <ellipse cx="2" cy="2" rx="${size*0.8}" ry="${size*0.4}" fill="rgba(0,0,0,0.2)" />
      
      <!-- Rocha -->
      <polygon points="${points.join(' ')}" fill="${color}" stroke="${borderColor}" stroke-width="1" />
      
      <!-- Destaques -->
      <circle cx="${-size*0.3}" cy="${-size*0.2}" r="${size*0.15}" fill="${highlightColor}" opacity="0.5" />
    </svg>
  `;
}

// Função auxiliar para ajustar a cor (clarear ou escurecer)
function adjustColor(color: string, amount: number): string {
  // Remove o hash se existir
  let hex = color.replace('#', '');
  
  // Converte para RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Ajusta os valores
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));
  
  // Converte de volta para hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Salva um asset como arquivo
export function createAssetFile(asset: AssetDefinition): void {
  // Nesta implementação, isso seria feito do lado do servidor
  // Mas podemos usar isso para gerar arquivos durante o build
  console.log(`Criando asset: ${asset.path}`);
}