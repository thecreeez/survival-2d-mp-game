import SharedData from "../../SharedData.js";
import HumanEntity from "./HumanEntity.js";
import PlasmaProjectileEntity from "./PlasmaProjectileEntity.js";

class PlayerEntity extends HumanEntity {
  static id = `player_entity`;

  name = new SharedData("name", SharedData.STR_T, "Player");

  // from client
  bWantAttack = false;
  bWantToCrawl = false;
  aimRotationFromClient = 0;
  attackCooldownMax = 200;

  constructor({ name = "user", worldId = "core:spawn", health = 100, position = [0, 0]} = {}) {
    super({
      moveSpeed: 5,
      position,
      health,
      worldId,
      tags: ["light-source", "light-color:0,120,0", "light-level:7"],
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

    if (this.aimRotationFromClient != this.aim_rotation.getValue()) {
      this.aim_rotation.setValue(this.aimRotationFromClient);
    }

    if (this.getState() == "attack" && this.attackCooldown < 0) {
      let dispersion = 5;
      let bulletPosition = [this.getPosition()[0], this.getPosition()[1] - this.getSize()[1] / 2];
      let bulletRotation = this.aim_rotation.getValue() + (Math.random() * dispersion - dispersion * 0.5) ;

      this.getWorld().application.spawnEntity(new PlasmaProjectileEntity({ ownerUuid: this.getUuid(), position: bulletPosition, worldId: this.getWorld().getId(), rotation: bulletRotation }));
      this.attackCooldown = this.attackCooldownMax;
    }

    this.attackCooldown -= deltaTick;
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

  updateServerRotation(application, deltaTick) {
    if (!this.canRotate(application)) {
      return;
    }

    if (this.getAimRotation() > 90 && this.getAimRotation() < 270) {
      this.rotation.setValue(1);
    } else {
      this.rotation.setValue(0);
    }
  }

  getName() {
    return this.name.getValue();
  }
}

export default PlayerEntity;