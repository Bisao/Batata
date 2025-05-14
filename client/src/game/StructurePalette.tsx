import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useGameStore } from "./stores/useGameStore";

const StructurePalette = () => {
  const { structureTypes, selectedStructure, selectStructure } = useGameStore();
  
  // Helper for styling the structure buttons
  const getButtonClasses = (structureType: string) => {
    return selectedStructure === structureType
      ? "border-primary bg-primary/10"
      : "border-border hover:bg-accent";
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Select a structure type to place on the grid
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(structureTypes).map(([type, data]) => (
          <HoverCard key={type} openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Button
                variant="outline"
                className={`h-20 flex flex-col items-center justify-center border-2 ${getButtonClasses(type)}`}
                onClick={() => selectStructure(type)}
              >
                <div className="text-2xl mb-1">
                  {data.icon}
                </div>
                <span className="text-xs font-semibold">{data.name}</span>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-72 p-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">{data.name}</h4>
                <p className="text-xs text-muted-foreground">{data.description}</p>
                <div className="grid grid-cols-2 gap-x-4 text-xs pt-2">
                  <div>
                    <span className="font-medium">Cost:</span> {data.cost}
                  </div>
                  <div>
                    <span className="font-medium">Size:</span> 1x1
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
      
      {selectedStructure && (
        <div className="mt-4 p-3 bg-muted rounded-md">
          <h3 className="text-sm font-medium mb-1">
            Selected: {structureTypes[selectedStructure].name}
          </h3>
          <p className="text-xs text-muted-foreground">
            Click on the grid to place this structure
          </p>
        </div>
      )}
    </div>
  );
};

export default StructurePalette;
