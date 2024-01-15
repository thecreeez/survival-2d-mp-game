import SharedData from "../../SharedData.js";
import LivingEntity from "./LivingEntity.js";

class PlayerEntity extends LivingEntity {
  name = new SharedData("name", SharedData.STR_T, "Player");
  b_sitting = new SharedData("b_sitting", SharedData.BUL_T, false);
  direction = new SharedData("direction", SharedData.POS_T, [0, 0]).makeImportant();

  constructor(name = "user", health = 100, pos = [0, 0]) {
    super("player_entity", health, pos, 5)
    this.name.setValue(name);
    this.b_sitting.setValue(false);
    this.direction.setValue([0,0]);
  }

  updateServerTick(application, deltaTick) {
    super.updateServerTick(application, deltaTick);

    if (!this.canMove(application)) {
      return;
    }

    if (this.getDirection()[0] != 0 || this.getDirection()[1] != 0) {
      this.position.setValue([this.getPosition()[0] + this.getDirection()[0] * this.move_speed.getValue(), this.getPosition()[1] + this.getDirection()[1] * this.move_speed.getValue()]);

      if (this.getDirection()[0] >= 0 && this.getDirection()[1] >= 0) {
        this.rotation.setValue(0);
      } else if (this.getDirection()[0] < 0 && this.getDirection()[1] >= 0) {
        this.rotation.setValue(1);
      } else if (this.getDirection()[0] >= 0 && this.getDirection()[1] < 0) {
        this.rotation.setValue(2);
      } else if (this.getDirection()[0] < 0 && this.getDirection()[1] < 0) {
        this.rotation.setValue(3);
      }

      this.lastTimeMove = Date.now();
    }
  }

  getName() {
    return this.name.getValue();
  }

  getDirection() {
    return this.direction.getValue();
  }

  setDirection(x, y) {
    this.direction.setValue([x, y]);
  }

  bSitting() {
    return this.b_sitting.getValue();
  }
}

export default PlayerEntity;