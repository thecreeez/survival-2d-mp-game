import MeleeAI from "../ai/MeleeAI.js";
import LivingEntity from "./LivingEntity.js";

class SpiderEntity extends LivingEntity {
  static id = `spider_entity`;
  static size = [50, 50];

  constructor({ worldId = "core:spawn", position = [0, 0] } = {}) {
    super({
      position,
      viewRange: 1000,
      health: 200,
      ai: new MeleeAI({
        targetId: "core:player_entity",
        targetTag: "human",
      }),
      damage: 10,
      attackRange: 50,
      moveSpeed: 40 * 5,
      worldId,
      states: ["idle", "walk", "hurt", "attack", "dead"],
      tags: ["hostile"]
    });
  }
}

export default SpiderEntity;