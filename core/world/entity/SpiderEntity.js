import EntityWithAI from "./EntityWithAI.js";

class SpiderEntity extends EntityWithAI {
  static id = `spider_entity`;
  static size = [50, 50];

  constructor({ worldId = "core:spawn", position = [0, 0] } = {}) {
    super({
      position,
      visionRange: 100,
      health: 100,
      target_class: "core:player_entity",
      target_tag: "human",
      damage: 3,
      attackRange: 50,
      moveSpeed: 1,
      worldId,
      states: ["idle", "walk", "hurt", "attack", "dead"]
    });
  }
}

export default SpiderEntity;