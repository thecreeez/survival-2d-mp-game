import SharedData from "../../SharedData.js";
import HumanEntity from "./HumanEntity.js";
import PlasmaProjectileEntity from "./PlasmaProjectileEntity.js";

class PlayerEntity extends HumanEntity {
  static id = `player_entity`;

  name = new SharedData("name", SharedData.STR_T, "Player");

  followers = new SharedData("followers", SharedData.NUM_T, 0);
  money = new SharedData("money", SharedData.NUM_T, 0);

  spot = new SharedData("spot", SharedData.POS_T, [0,0]);
  have_spot = new SharedData("have_spot", SharedData.BUL_T, false);

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

    if (this.bAttacking() && this.canShoot() && this.getState() != "attack") {
      this.setState("attack")
    }

    if (this.getState() == "attack" && (!this.bAttacking() || !this.canShoot())) {
      this.setState("idle")
    }

    if (this.getState() != "crawl" && this.bWantToCrawl && this.canCrawl()) {
      this.setState("crawl");
    }

    if (this.getState() == "crawl" && (!this.bCrawling() || !this.canCrawl())) {
      this.setState("idle");
    }
  }

  getFollowers() {
    return this.followers.getValue();
  }

  getMoney() {
    return this.money.getValue();
  }

  getSpot() {
    if (!this.have_spot.getValue()) {
      return false;
    }

    return this.spot.getValue();
  }

  getName() {
    return this.name.getValue();
  }
}

export default PlayerEntity;