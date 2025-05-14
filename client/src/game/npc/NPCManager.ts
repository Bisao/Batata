
import { NPC } from './NPC';
import { NPCData, NPCState, NPCProfession } from './NPCTypes';

export class NPCManager {
  private npcs: Map<string, NPC> = new Map();

  createNPC(data: NPCData): NPC {
    const npc = new NPC(data);
    this.npcs.set(data.id, npc);
    return npc;
  }

  updateNPCs(deltaTime: number) {
    this.npcs.forEach(npc => npc.update(deltaTime));
  }

  getNPC(id: string): NPC | undefined {
    return this.npcs.get(id);
  }

  getAllNPCs(): NPC[] {
    return Array.from(this.npcs.values());
  }
}
