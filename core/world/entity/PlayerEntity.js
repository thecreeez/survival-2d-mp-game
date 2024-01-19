import SharedData from "../../SharedData.js";
import LivingEntity from "./LivingEntity.js";

class PlayerEntity extends LivingEntity {
  static id = `player_entity`;

  name = new SharedData("name", SharedData.STR_T, "Player");
  b_crawling = new SharedData("b_crawling", SharedData.BUL_T, false)
  b_attacking = new SharedData("b_attacking", SharedData.BUL_T, false);

  // from client
  bWantAttack = false;
  bWantToCrawl = false;

  constructor({ name = "user", worldId = "core:spawn", health = 100, position = [0, 0]} = {}) {
    super({
      attackRange: 50,
      damage: 10,
      moveSpeed: 5,
      position,
      health,
      worldId,
      states: ["idle", "walk", "crawl", "attack", "hurt", "dead", "throw"]
    });
    
    this.name.setValue(name);
    this.direction.setValue([0,0]);
  }

  updateServerTick(application, deltaTick) {
    super.updateServerTick(application, deltaTick);

    if (this.bWantAttack != this.b_attacking.getValue()) {
      this.b_attacking.setValue(this.bWantAttack);
    }

    if (this.bWantToCrawl != this.b_crawling.getValue()) {
      this.b_crawling.setValue(this.bWantToCrawl);
    }

    if (this.getState() == "attack") {
      this.getAttackableEntitiesInAttackRange(application).forEach((entity) => {
        entity.handleDamage(this, this.damage.getValue());
      })
    }
  }

  updateServerState(application, deltaTick) {
    super.updateServerState(application, deltaTick);

    if (this.getState() == "dead") {
      return;
    }

    if (this.bAttacking() && this.canAttack() && this.getState() != "attack") {
      this.setState("attack")
    }

    if (this.getState() == "attack" && (!this.bAttacking() || !this.canAttack())) {
      this.setState("idle")
    }

    if (this.getState() != "crawl" && this.bWantToCrawl && this.canCrawl()) {
      this.setState("crawl");
    }

    if (this.getState() == "crawl" && (!this.bCrawling() || !this.canCrawl())) {
      this.setState("idle");
    }
  }

  getAttackableEntitiesInAttackRange(application) {
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

  getAttackRange() {
    return this.attack_range.getValue();
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
}

export default PlayerEntity;