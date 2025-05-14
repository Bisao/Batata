
import { useIsMobile } from "@/hooks/use-is-mobile";
import { Card } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ReactNode } from "react";

interface ResponsiveLayoutProps {
  gameBoard: ReactNode;
  sidebar: ReactNode;
}

export function ResponsiveLayout({ gameBoard, sidebar }: ResponsiveLayoutProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="h-screen w-screen relative">
        <div className="w-full h-full">{gameBoard}</div>
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-4 right-4 z-50"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="p-4">{sidebar}</div>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-row gap-6">
        <div className="w-3/4">
          <Card className="overflow-hidden">{gameBoard}</Card>
        </div>
        <div className="w-1/4">{sidebar}</div>
      </main>
    </div>
  );
}
