import MathUtils from "../../utils/MathUtils.js";
import AI from "./AI.js";

class RangeAI extends AI {
  handleAttack(entity) {
    this.entity.aim_rotation.setValue(MathUtils.getRotation([this.currentTargetPos[0] - this.entity.getPosition()[0], this.currentTargetPos[1] - this.entity.getPosition()[1]]));
    this.entity.shoot();
  }

  canAttack(entity) {
    if (!this.entity.canShoot) {
      console.error(`Entity can't shoot!`);
      return false;
    }

    return this.entity.canShoot();
  }
}

export default RangeAI;