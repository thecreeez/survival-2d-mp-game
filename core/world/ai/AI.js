import MathUtils from "../../utils/MathUtils.js";

class AI {
  currentTarget = null;
  currentTargetPos = null;

  targetToAttack = {
    id: "player_entity",
    tag: "human"
  };

  // Setting when entity is creates;
  entity = null;

  constructor({ targetId, targetTag }) {
    this.targetToAttack.id = targetId;
    this.targetToAttack.tag = targetTag;
  }

  updateServerTick() {
    this._updateTarget();
    this._updateDirection();
    this._updateEntityAiData();
  }

  _updateTarget() {
    if (this.currentTarget === null) {
      let target = this._getNewTarget();

      if (target !== null) {
        this.currentTarget = target;
        this.currentTargetPos = [...target.getPosition()];
      }
      return;
    }

    if (this.entity.distanceTo(this.currentTarget) > this.entity.getViewDistance()) {
      this.currentTarget = null;
      return;
    }

    if (this.currentTarget.isDead()) {
      this.currentTarget = null;
      return;
    }

    if (this.entity.getWorld().getEntities().filter(entity => entity == this.currentTarget).length == 0) {
      this.currentTarget = null;
      return;
    }

    this.currentTargetPos = [...this.currentTarget.getPosition()];
  }

  _getNewTarget() {
    let possibleTarget = null;

    this.entity.getWorld().getEntities().filter((otherEntity) => {
      if (otherEntity == this.entity)
        return;

      if (this.entity.distanceTo(otherEntity) > this.entity.getViewDistance())
        return;

      if (this.targetToAttack.id != otherEntity.getFullId() && otherEntity.getTags().indexOf(this.targetToAttack.tag) == -1)
        return;

      if (otherEntity.isDead())
        return;

      possibleTarget = otherEntity;
    })

    return possibleTarget;
  }

  getTargetEntity() {
    return this.currentTarget;
  }

  _updateEntityAiData() {
    this.entity.ai_data.setValue({
      target: this.currentTarget ? this.currentTarget.getUuid() : "no_target",
      pos: this.currentTargetPos
    })
  }

  _updateDirection() {
    if (!this._wannaMove()) {
      this.entity.setDirection(0,0);
      return;
    }

    let targetPosition = this.currentTargetPos;
    let entityPosition = this.entity.getPosition();

    let moving = [0,0]

    if (entityPosition[1] < targetPosition[1]) {
      moving[1] = this.entity.move_speed.getValue();
    };

    if (entityPosition[1] > targetPosition[1]) {
      moving[1] = -this.entity.move_speed.getValue();
    }

    if (entityPosition[0] < targetPosition[0]) {
      moving[0] = this.entity.move_speed.getValue();
    }

    if (entityPosition[0] > targetPosition[0]) {
      moving[0] = -this.entity.move_speed.getValue();
    }

    if (moving[0] != 0 && moving[1] != 0) {
      moving[0] /= 2;
      moving[1] /= 2;
    }

    if (moving[0] == this.entity.direction.getValue()[0] && moving[1] == this.entity.direction.getValue()[1]) {
      return;
    }
  
    this.entity.direction.setValue(moving);
  }

  _wannaMove() {
    if (this.currentTarget && this.entity.distanceTo(this.currentTarget) < this.entity.getAttackRange()) {
        return false;
    }

    return this.currentTarget || MathUtils.distanceBetween([...this.currentTargetPos], [...this.entity.getPosition()]) > this.entity.getMoveSpeed();
  }
}

export default AI;