import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import GameBoard from "./game/GameBoard";
import StructurePalette from "./game/StructurePalette";
import { useGameStore } from "./game/stores/useGameStore";
import { ResponsiveLayout } from "./game/ui/ResponsiveLayout";

function App() {
  const [loading, setLoading] = useState(true);
  const { initializeGame } = useGameStore();

  useEffect(() => {
    initializeGame();
    setLoading(false);
  }, [initializeGame]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading game...</div>
      </div>
    );
  }

  const sidebar = (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-4">Building Structures</h2>
        <Separator className="my-2" />
        <StructurePalette />
      </CardContent>
    </Card>
  );

  return (
    <>
      <ResponsiveLayout 
        gameBoard={<GameBoard />}
        sidebar={sidebar}
      />
      <Toaster />
    </>
  );
}

export default App;