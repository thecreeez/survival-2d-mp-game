import MathUtils from "../../utils/MathUtils.js";
import AI from "./AI.js";

class RangeAI extends AI {
  handleAttack(entity) {
    this.entity.aim_rotation.setValue(this.getRotationToShoot(this.currentTargetPos));
    this.entity.shoot();
  }

  canAttack(entity) {
    if (!this.entity.canShoot) {
      console.error(`Entity can't shoot!`);
      return false;
    }

    let rotationToShootTarget = this.getRotationToShoot(this.currentTargetPos);

    let canAllyBeAttacked = false;

    this.getAllies()
      .filter(entityCandidate => this.entity.distanceTo(entityCandidate) < MathUtils.getDistance(this.entity.getPosition(), this.currentTargetPos))
      .forEach(entityCandidate => {
        let rotationToShootAlly = this.getRotationToShoot(entityCandidate.getPosition());

        let differenceBetweenShotToTargetAndAlly = Math.abs(rotationToShootTarget - rotationToShootAlly);

        if (differenceBetweenShotToTargetAndAlly < 40 || differenceBetweenShotToTargetAndAlly > 320) {
          canAllyBeAttacked = true;
        }
      })

    return !canAllyBeAttacked && this.entity.canShoot();
  }

  getRotationToShoot(position) {
    return MathUtils.getRotation([position[0] - this.entity.getPosition()[0], position[1] - this.entity.getPosition()[1]]);
  }
}

export default RangeAI;