import EntityWithAI from "./EntityWithAI.js";

class OrcEntity extends EntityWithAI {
  static id = `orc_entity`;

  constructor({ position = [0, 0]} = {}) {
    super({
      position,
      visionRange: 100,
      health: 100,
      target_class: "core:player_entity",
      damage: 3,
      attackRange: 50,
      moveSpeed: 2
    });
  }
}

export default OrcEntity;