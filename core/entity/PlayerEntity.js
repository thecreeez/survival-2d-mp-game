import SharedData from "../SharedData.js";
import LivingEntity from "./LivingEntity.js";

class PlayerEntity extends LivingEntity {
  name = new SharedData("name", SharedData.STR_T, "Player")
  level = new SharedData("level", SharedData.NUM_T, 100)
  b_sitting = new SharedData("b_sitting", SharedData.BUL_T, false)

  r = new SharedData("r", SharedData.NUM_T, 100)
  g = new SharedData("g", SharedData.NUM_T, 100)
  b = new SharedData("b", SharedData.NUM_T, 100)

  constructor(name = "user", health = 100, pos = [0, 0]) {
    super("player_entity", health, pos)
    this.name.setValue(name);
    this.b_sitting.setValue(false);

    this.r.setValue(Math.floor(Math.random() * 255));
    this.g.setValue(Math.floor(Math.random() * 255));
    this.b.setValue(Math.floor(Math.random() * 255));

    this.level.setValue(12);
  }

  getName() {
    return this.name.getValue();
  }

  getColor() {
    return `rgb(${this.r.getValue()},${this.g.getValue()},${this.b.getValue()})`;
  }
}

export default PlayerEntity;