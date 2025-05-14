/**
 * MapThemeSelector.tsx
 * Componente para seleção de diferentes temas de mapa
 */

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapTheme } from "../MapGenerator";
import { useGameWorld } from "../stores/useGameWorld";
import { useEffect, useState } from "react";

const themes = [
  { value: MapTheme.DEFAULT, label: "Padrão" },
  { value: MapTheme.FOREST, label: "Floresta" },
  { value: MapTheme.DESERT, label: "Deserto" },
  { value: MapTheme.MOUNTAINS, label: "Montanhas" },
  { value: MapTheme.MIXED, label: "Misto" },
];

interface MapThemeSelectorProps {
  onThemeChange?: (theme: MapTheme) => void;
}

const MapThemeSelector: React.FC<MapThemeSelectorProps> = ({ onThemeChange }) => {
  const { initializeWorld } = useGameWorld();
  const [selectedTheme, setSelectedTheme] = useState<MapTheme>(MapTheme.DEFAULT);

  const handleThemeChange = (value: string) => {
    const theme = value as MapTheme;
    setSelectedTheme(theme);
    
    // Inicializa o mundo com o novo tema
    initializeWorld(theme);
    
    // Notifica o componente pai, se necessário
    if (onThemeChange) {
      onThemeChange(theme);
    }
  };

  useEffect(() => {
    // Inicializa com o tema padrão ao montar o componente
    initializeWorld(selectedTheme);
  }, []);

  return (
    <div className="space-y-2">
      <label htmlFor="map-theme" className="text-sm font-medium">
        Tema do Mapa
      </label>
      <Select value={selectedTheme} onValueChange={handleThemeChange}>
        <SelectTrigger id="map-theme" className="w-full">
          <SelectValue placeholder="Selecione um tema" />
        </SelectTrigger>
        <SelectContent>
          {themes.map((theme) => (
            <SelectItem key={theme.value} value={theme.value}>
              {theme.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MapThemeSelector;