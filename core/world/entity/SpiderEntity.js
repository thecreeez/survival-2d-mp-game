import MeleeAI from "../ai/MeleeAI.js";
import LivingEntity from "./LivingEntity.js";

class SpiderEntity extends LivingEntity {
  static id = `spider_entity`;
  static size = [50, 50];

  constructor({ worldId = "core:spawn", position = [0, 0] } = {}) {
    super({
      position,
      visionRange: 100,
      health: 100,
      ai: new MeleeAI({
        targetId: "core:player_entity",
        targetTag: "human",
      }),
      damage: 3,
      attackRange: 50,
      moveSpeed: 1,
      worldId,
      states: ["idle", "walk", "hurt", "attack", "dead"]
    });
  }
}

export default SpiderEntity;