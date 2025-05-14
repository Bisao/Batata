import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useGameWorld } from "../stores/useGameWorld";

const StructurePaletteNew: React.FC = () => {
  const { structureTypes, selectedStructure, selectStructure, resources } = useGameWorld();

  const getButtonClasses = (structureType: string) => {
    return selectedStructure === structureType
      ? "border-primary bg-primary/20"
      : "border-gray-700 hover:bg-gray-700/50";
  };

  const canAfford = (cost: number) => resources >= cost;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-amber-300 bg-amber-900/50 px-2 py-1 rounded">
          Recursos: {resources}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {Object.entries(structureTypes).map(([type, data]) => {
          const affordable = canAfford(data.cost);

          return (
            <HoverCard key={type} openDelay={200}>
              <HoverCardTrigger asChild>
                <Button
                  variant="outline"
                  className={`h-16 flex flex-col items-center justify-center border ${getButtonClasses(type)} 
                    ${!affordable ? 'opacity-50 cursor-not-allowed' : ''} transition-all`}
                  onClick={() => affordable && selectStructure(type as any)}
                  disabled={!affordable}
                >
                  <div className="text-xl mb-1">{data.icon}</div>
                  <span className="text-xs font-medium text-gray-300">{data.name}</span>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 p-3 bg-gray-800 border-gray-700">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-white">{data.name}</h4>
                  <p className="text-xs text-gray-400">{data.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                    <div>Custo: {data.cost}</div>
                    <div>Tamanho: {data.size.width}x{data.size.height}</div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </div>

      {selectedStructure && (
        <div className="mt-3 p-2 bg-gray-700/50 rounded-md">
          <p className="text-xs text-gray-300">
            Clique no grid para construir {structureTypes[selectedStructure].name.toLowerCase()}
          </p>
        </div>
      )}
    </div>
  );
};

export default StructurePaletteNew;