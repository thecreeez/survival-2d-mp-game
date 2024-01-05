import SharedData from "../../SharedData.js";
import LivingEntity from "./LivingEntity.js";

class PlayerEntity extends LivingEntity {
  name = new SharedData("name", SharedData.STR_T, "Player")
  b_sitting = new SharedData("b_sitting", SharedData.BUL_T, false)

  constructor(name = "user", health = 100, pos = [0, 0]) {
    super("player_entity", health, pos)
    this.name.setValue(name);
    this.b_sitting.setValue(false);
  }

  getName() {
    return this.name.getValue();
  }
}

export default PlayerEntity;