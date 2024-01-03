import SharedData from "../SharedData.js";
import Entity from "./Entity.js";

class LivingEntity extends Entity {
  health = new SharedData("health", SharedData.NUM_T, 100)
  hurt_time = new SharedData("hurt_time", SharedData.NUM_T, 0)

  constructor(id, health = 100, pos = [0, 0]) {
    super(id, pos)
    this.health.setValue(health);
  }

  updateServerTick(application) {
    super.updateServerTick(application);

    if (this.hurt_time.getValue() > 0) {
      this.hurt_time.setValue(this.hurt_time.getValue() - 1);
    }
  }

  handleDamage(entity, damage) {
    this.hurt_time.setValue(100);
    this.health.setValue(this.health.getValue() - damage);
  }
}

export default LivingEntity;