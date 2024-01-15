import EntityWithAI from "./EntityWithAI.js";

class OrcEntity extends EntityWithAI {
  constructor({position = [0, 0]} = {}) {
    super({
      id: "orc_entity",
      position,
      visionRange: 100,
      health: 100,
      target_class: "player_entity",
      damage: 3,
      attackRange: 50,
      moveSpeed: 2
    });
  }
}

export default OrcEntity;