import SharedData from "../../SharedData.js";
import LivingEntity from "./LivingEntity.js";

class PlayerEntity extends LivingEntity {
  name = new SharedData("name", SharedData.STR_T, "Player");
  b_sitting = new SharedData("b_sitting", SharedData.BUL_T, false).makeImportant();
  b_attacking = new SharedData("b_attacking", SharedData.BUL_T, false);
  direction = new SharedData("direction", SharedData.POS_T, [0, 0]).makeImportant();

  // from client
  bWantAttack = false;

  constructor({ name = "user", health = 100, position = [0, 0]} = {}) {
    super({
      id: "player_entity",
      attackRange: 50,
      damage: 10,
      moveSpeed: 5,
      position,
      health
    });
    
    this.name.setValue(name);
    this.b_sitting.setValue(false);
    this.direction.setValue([0,0]);
  }

  updateServerTick(application, deltaTick) {
    if (this.bWantAttack != this.b_attacking.getValue()) {
      this.b_attacking.setValue(this.bWantAttack);
    }

    if (this.canMove(application)) {
      this.updateServerMovement(application, deltaTick);
    }

    if (this.canRotate(application)) {
      this.updateServerRotation(application, deltaTick);
    }

    this.updateServerState(application, deltaTick);

    if (this.getState() == "attack") {
      this.getAttackablEntitiesInAttackRange(application).forEach((entity) => {
        entity.handleDamage(this, this.damage.getValue());
      })
    }
  }

  updateServerMovement(application, deltaTick) {
    if (this.getDirection()[0] != 0 || this.getDirection()[1] != 0) {
      this.position.setValue([this.getPosition()[0] + this.getDirection()[0] * this.move_speed.getValue(), this.getPosition()[1] + this.getDirection()[1] * this.move_speed.getValue()]);

      this.lastTimeMove = Date.now();
    }
  }

  updateServerRotation(application, deltaTick) {
    if (this.getDirection()[0] != 0) {
      if (this.getDirection()[0] >= 0 && this.getDirection()[1] >= 0) {
        this.rotation.setValue(0);
      } else if (this.getDirection()[0] < 0 && this.getDirection()[1] >= 0) {
        this.rotation.setValue(1);
      }
    }

    if (this.getDirection()[1] != 0) {
      if (this.getDirection()[0] >= 0 && this.getDirection()[1] < 0) {
        this.rotation.setValue(2);
      } else if (this.getDirection()[0] < 0 && this.getDirection()[1] < 0) {
        this.rotation.setValue(3);
      }
    }
  }

  updateServerState(application, deltaTick) {
    super.updateServerState(application, deltaTick);

    if (this.bAttacking() && this.canAttack() && this.getState() != "attack") {
      this.state.setValue("attack");
    }

    if (this.getState() == "attack" && (!this.bAttacking() || !this.canAttack())) {
      this.state.setValue("idle");
    }
  }

  getAttackablEntitiesInAttackRange(application) {
    let pos = [this.getPosition()[0], this.getPosition()[1] - this.getAttackRange()];
    let size = [this.getAttackRange(), this.getAttackRange() * 2];

    if (this.getLookingSide() == `left`) {
      pos[0] -= this.getAttackRange();
    }

    let entityInAttackRange = (entity) => {
      if (entity == this)
        return false;

      if (!entity.health)
        return false;

      if (entity.hurt_time.getValue() > 0)
        return false;
      
      let entityPos = entity.getPosition();

      if (entityPos[0] < pos[0])
        return false;

      if (entityPos[0] > pos[0] + size[0])
        return false;

      if (entityPos[1] < pos[1])
        return false;

      if (entityPos[1] > pos[1] + size[1])
        return false;

      return true;
    }

    return application.getEntities().filter(entityInAttackRange);
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

  getAttackRange() {
    return this.attack_range.getValue();
  }

  bSitting() {
    return this.b_sitting.getValue();
  }

  bAttacking() {
    return this.b_attacking.getValue();
  }

  canAttack() {
    return true;
  }

  canMove(application) {
    return super.canMove(application) && !this.bAttacking();
  }

  canRotate(application) {
    return true;
  }
}

export default PlayerEntity;