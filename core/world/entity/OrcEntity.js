import EntityWithAI from "./EntityWithAI.js";

class OrcEntity extends EntityWithAI {
  constructor({pos = [0, 0]} = {}) {
    super("orc_entity", pos, 100, { target_class: "player_entity" });

    this.target_vision_range.setValue(100);
  }
}

export default OrcEntity;