
import { NPCData, NPCState, NPCProfession } from './NPCTypes';

export class NPC {
  private data: NPCData;
  private path: Array<{x: number, y: number}> = [];
  private inventory: Record<string, number>;
  private isMoving: boolean = false;

  constructor(data: NPCData) {
    this.data = {
      ...data,
      level: 1,
      xp: 0,
      maxXp: 100,
    };
    this.inventory = this.getInitialInventory();
  }

  private getInitialInventory(): Record<string, number> {
    const baseInventory = { maxCapacity: 5 };
    
    switch (this.data.profession) {
      case NPCProfession.LUMBERJACK:
        return { ...baseInventory, wood: 0 };
      case NPCProfession.FARMER:
        return { ...baseInventory, wheat: 0, seeds: 0 };
      case NPCProfession.MINER:
        return { ...baseInventory, ore: 0 };
      case NPCProfession.FISHERMAN:
        return { ...baseInventory, fish: 0 };
      default:
        return baseInventory;
    }
  }

  update(deltaTime: number) {
    if (this.data.state === NPCState.WALKING) {
      this.updateMovement(deltaTime);
    }
  }

  private updateMovement(deltaTime: number) {
    if (this.path.length > 0) {
      const target = this.path[0];
      const dx = target.x - this.data.x;
      const dy = target.y - this.data.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 0.1) {
        this.path.shift();
        if (this.path.length === 0) {
          this.data.state = NPCState.IDLE;
          this.isMoving = false;
        }
      } else {
        const moveX = (dx / distance) * this.data.speed * deltaTime;
        const moveY = (dy / distance) * this.data.speed * deltaTime;
        this.data.x += moveX;
        this.data.y += moveY;
      }
    }
  }

  gainExperience(amount: number) {
    this.data.xp += amount;
    if (this.data.xp >= this.data.maxXp) {
      this.data.level++;
      this.data.xp = 0;
      this.data.maxXp *= 1.5;
    }
  }

  moveTo(x: number, y: number) {
    if (!this.isMoving) {
      this.path = [{x, y}];
      if (this.path.length > 0) {
        this.data.state = NPCState.WALKING;
        this.isMoving = true;
      }
    }
  }

  getPosition() {
    return { x: this.data.x, y: this.data.y };
  }

  getState() {
    return this.data.state;
  }

  getData() {
    return this.data;
  }
}
