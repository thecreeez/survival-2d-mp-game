import LivingEntity from "./LivingEntity.js";
import SharedData from "../../SharedData.js";

class HumanEntity extends LivingEntity {
  static size = [50,50];

  b_crawling = new SharedData("b_crawling", SharedData.BUL_T, false);
  b_attacking = new SharedData("b_attacking", SharedData.BUL_T, false);
  aim_rotation = new SharedData("aim_rotation", SharedData.NUM_T, 0);

  type = new SharedData("type", SharedData.STR_T, "default");

  constructor({ moveSpeed, position, health, worldId, states = [], tags = [], type = "default" } = {}) {
    super({
      attackRange: 0,
      damage: 0,
      worldId,
      health,
      position,
      moveSpeed,
      states: ["idle", "walk", "crawl", "attack", "hurt", "dead", "throw", ...states],
      tags,
      customTexture: type
    })

    this.type.setValue(type);
    this.tags.push("human");
  }

  getAimRotation() {
    return this.aim_rotation.getValue();
  }

  bCrawling() {
    return this.b_crawling.getValue();
  }

  bAttacking() {
    return this.b_attacking.getValue();
  }

  canAttack() {
    return super.canAttack() && this.b_alive.getValue();
  }

  canMove(application) {
    return super.canMove(application) && !this.bAttacking();
  }

  canCrawl() {
    if (this.getTimeAfterLastMove() < 50) {
      return false;
    }

    return this.getState() == "idle" || this.getState() == "crawl";
  }

  getTexture() {
    if (this.type.getValue() != this.texture.getValue()) {
      this.texture.setValue(this.type.getValue());
    }

    return this.texture.getValue();
  }
}

export default HumanEntity;