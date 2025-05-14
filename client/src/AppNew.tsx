import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import IsometricWorld from "./game/IsometricWorld";
import StructurePaletteNew from "./game/ui/StructurePaletteNew";
import GameAssetLoader from "./game/ui/GameAssetLoader";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

function AppNew() {
  const [showStructures, setShowStructures] = useState(false);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <GameAssetLoader>
        {/* Grid em tela cheia */}
        <div className="absolute inset-0">
          <IsometricWorld />
        </div>

        {/* Botão flutuante */}
        <div className="fixed bottom-4 left-4 flex gap-2 z-50">
          <Button 
            variant="secondary" 
            size="icon"
            className="w-12 h-12 rounded-full bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm"
            onClick={() => setShowStructures(!showStructures)}
          >
            <Home className="h-6 w-6" />
          </Button>
        </div>

        {/* Painel flutuante - responsivo */}
        {showStructures && (
          <div className="fixed right-4 top-4 w-full max-w-[300px] space-y-4 z-40">
            <Card className="bg-gray-800/90 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-4">
                <h2 className="text-lg font-bold text-white mb-2">Construções</h2>
                <Separator className="my-2 bg-gray-700" />
                <StructurePaletteNew />
              </CardContent>
            </Card>
          </div>
        )}
      </GameAssetLoader>
      <Toaster />
    </div>
  );
}

export default AppNew;