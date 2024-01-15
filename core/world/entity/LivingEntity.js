import SharedData from "../../SharedData.js";
import Entity from "./Entity.js";

class LivingEntity extends Entity {
  health = new SharedData("health", SharedData.NUM_T, 100);
  hurt_time = new SharedData("hurt_time", SharedData.NUM_T, 0);
  move_speed = new SharedData("move_speed", SharedData.NUM_T, 1);

  state = new SharedData("state", SharedData.STR_T, "idle");
  rotation = new SharedData("rotation", SharedData.NUM_T, 0);

  // SERVER
  lastTimeMove = 0;

  // Client
  currentSprite = 0;
  currentSpriteTime = 0;

  constructor(id, health = 100, pos = [0, 0], moveSpeed = 1) {
    super(id, pos)
    this.health.setValue(health);
    this.move_speed.setValue(moveSpeed);
  }

  updateServerTick(application, deltaTick) {
    this.updateServerState(application, deltaTick);
  }

  updateServerState(application, deltaTick) {
    if (this.hurt_time.getValue() > 0) {
      this.hurt_time.setValue(this.hurt_time.getValue() - deltaTick);
    }

    if (this.getTimeAfterLastMove() > 50 && this.getState() == "walk") {
      this.state.setValue("idle");
    }

    if (this.getTimeAfterLastMove() < 50 && this.getState() == "idle") {
      this.state.setValue("walk");
    }

    if (this.getState() == "hurt" && this.hurt_time.getValue() <= 0) {
      this.state.setValue("idle");
    }
  }

  handleDamage(entity, damage) {
    this.hurt_time.setValue(400);
    this.state.setValue("hurt");
    this.health.setValue(this.health.getValue() - damage);
  }

  getState() {
    return this.state.getValue();
  }

  getRotation() {
    return this.rotation.getValue();
  }

  getLookingSide() {
    let side = `right`;

    switch (this.getRotation()) {
      case 1: side = `left`; break;
      case 3: side = `left`; break;
    }

    return side;
  }

  getTimeAfterLastMove() {
    return Date.now() - this.lastTimeMove;
  }

  canMove(application) {
    return true;
  }
}

export default LivingEntity;