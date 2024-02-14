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

  constructor({ targetId, targetTag, events = {} }) {
    this.targetToAttack.id = targetId;
    this.targetToAttack.tag = targetTag;

    this.needToSaveInObject = false;

    this.events = events;
    this.prevEntitiesInViewDistance = [];
  }

  updateServerTick() {
    this._updateView();
    this._updateTarget();
    this._updateDirection();
    this._updateEntityAiData();
    this._updateAttack();
  }

  _updateView() {
    let nearbyEntities = this.entity
      .getWorld()
      .getEntities()
      .filter(entity => entity !== this.entity && this.entity.distanceTo(entity) < this.entity.getViewDistance());

    nearbyEntities.forEach(entity => {
      if (this.prevEntitiesInViewDistance.indexOf(entity) === -1) {
        this.entityMoveInToViewDistance(entity);
      }
    })

    this.prevEntitiesInViewDistance.forEach(entity => {
      if (nearbyEntities.indexOf(entity) === -1) {
        this.entityMoveOutFromViewDistance(entity);
      }
    })

    this.prevEntitiesInViewDistance = nearbyEntities;
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
      this.entity.setDirection(0, 0);
      return;
    }

    let targetPosition = this.currentTargetPos;
    let entityPosition = this.entity.getPosition();

    let moving = [0, 0]

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

  _updateAttack() {
    if (this.currentTarget === null) {
      return;
    }

    if (!this.canAttack(this.currentTarget)) {
      return;
    }

    this.entity.rotation.setValue(this.currentTarget.getPosition()[0] > this.entity.getPosition()[0] ? 0 : 1);
    this.handleAttack(this.currentTarget);
  }

  // Мстить
  handleDamage(entity) {
    if (!entity) {
      return;
    }

    if (entity.getOwner) {
      entity = entity.getOwner();
    }

    this.currentTarget = entity;
    this.currentTargetPos = [...entity.getPosition()];

    this.handleAttackFromEntity(entity);
  }

  handleAttack(entity) {
    throw new Error("Attack handle isn't defined.");
  }

  canAttack(entity) {
    throw new Error("Attack type isn't defined.");
  }

  entityMoveInToViewDistance(entity) {
    if (this.events["entityMoveInToViewDistance"]) {
      this.events["entityMoveInToViewDistance"](entity)
    }
  }

  entityMoveOutFromViewDistance(entity) {
    if (this.events["entityMoveOutFromViewDistance"]) {
      this.events["entityMoveOutFromViewDistance"](entity)
    }
  }

  handleAttackFromEntity(entity) {
    if (this.events["handleAttackFromEntity"]) {
      this.events["handleAttackFromEntity"](entity)
    }
  }

  _wannaMove() {
    if (this.currentTarget && this.entity.distanceTo(this.currentTarget) < this.entity.getAttackRange()) {
      return false;
    }

    if (!this.currentTargetPos) {
      return false;
    }

    return MathUtils.distanceBetween([...this.currentTargetPos], [...this.entity.getPosition()]) > this.entity.getMoveSpeed();
  }

  clearTarget() {
    this.currentTarget = null;
    this.currentTargetPos = [...this.entity.getPosition()];
  }

  getAllies() {
    let importantTag = this.entity.getTags()[0];

    if (!importantTag) {
      return [];
    }

    return this.entity.getWorld().getEntities().filter(entity => entity !== this.entity && entity.haveTag(importantTag));
  }

  isAlly(entity) {
    let importantTag = this.entity.getTags()[0];

    if (!importantTag) {
      return false;
    }

    return entity.haveTag(importantTag);
  }

  toObject() {

  }
}

export default AI;