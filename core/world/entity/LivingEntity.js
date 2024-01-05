import SharedData from "../../SharedData.js";
import Entity from "./Entity.js";

class LivingEntity extends Entity {
  health = new SharedData("health", SharedData.NUM_T, 100);
  hurt_time = new SharedData("hurt_time", SharedData.NUM_T, 0);

  state = new SharedData("state", SharedData.STR_T, "idle");
  rotation = new SharedData("rotation", SharedData.NUM_T, 0);

  // SERVER
  lastTimeMove = 0;

  // Client
  currentSprite = 0;
  currentSpriteTime = 0;

  constructor(id, health = 100, pos = [0, 0]) {
    super(id, pos)
    this.health.setValue(health);
  }

  updateServerTick(application, deltaTick) {
    super.updateServerTick(application, deltaTick);

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

  getTimeAfterLastMove() {
    return Date.now() - this.lastTimeMove;
  }
}

export default LivingEntity;