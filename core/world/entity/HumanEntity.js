import LivingEntity from "./LivingEntity.js";
import SharedData from "../../SharedData.js";
import PlasmaProjectileEntity from "./PlasmaProjectileEntity.js";

class HumanEntity extends LivingEntity {
  static size = [50,50];

  b_crawling = new SharedData("b_crawling", SharedData.BUL_T, false);
  b_attacking = new SharedData("b_attacking", SharedData.BUL_T, false);
  aim_rotation = new SharedData("aim_rotation", SharedData.NUM_T, 0);

  have_leader = new SharedData("have_leader", SharedData.BUL_T, false);
  leader_name = new SharedData("leader_name", SharedData.STR_T, "no_leader");
  message = new SharedData("message", SharedData.STR_T, "[EMPTY_MESSAGE]");

  type = new SharedData("type", SharedData.STR_T, "default");

  attackCooldownMax = 200;
  messageTime = 0;

  constructor({ moveSpeed, position, health, worldId, states = [], tags = [], type = "default", ai = null, viewRange = 500, leader = null } = {}) {
    super({
      attackRange: 0,
      damage: 0,
      worldId,
      health,
      position,
      moveSpeed,
      states: ["idle", "walk", "crawl", "attack", "hurt", "dead", "throw", ...states],
      tags,
      customTexture: type,
      ai,
      viewRange,
    })

    this.type.setValue(type);
    this.tags.push("human");

    if (leader) {
      this.leader_name.setValue(leader.getName());
      this.have_leader.setValue(true);
    }
  }

  updateServerTick(application, deltaTick) {
    super.updateServerTick(application, deltaTick);
    if (this.getState() == "attack" && this.attackCooldown < 0) {
      this.shoot();
    }

    this.attackCooldown -= deltaTick;

    if (this.messageTime <= 0 && this.getMessage()) {
      this.setMessage(false);
    }

    this.messageTime -= deltaTick;
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

  canMove(application) {
    return super.canMove(application) && !this.bAttacking();
  }

  canCrawl() {
    if (this.getTimeAfterLastMove() < 50) {
      return false;
    }

    return this.getState() == "idle" || this.getState() == "crawl";
  }

  canShoot() {
    return super.canShoot() && this.attackCooldown <= 0;
  }

  getTexture() {
    if (this.type.getValue() != this.texture.getValue()) {
      this.texture.setValue(this.type.getValue());
    }

    return this.texture.getValue();
  }

  getMessage() {
    if (this.message.getValue() === "[EMPTY_MESSAGE]")
      return false;

    return this.message.getValue();
  }

  setMessage(message = false, time = 1000) {
    if (!message) {
      this.message.setValue("[EMPTY_MESSAGE]");
      return;
    }

    this.message.setValue(message);
    this.messageTime = time;
  }

  getLeaderName() {
    if (!this.have_leader.getValue()) {
      return false;
    }

    return this.leader_name.getValue();
  }

  shoot() {
    let dispersion = 5;
    //                                                                 - this.getSize()[1] / 2 <- для красоты НАДО, но нужно вычислить как это повлияет на rotation soso
    let bulletPosition = [this.getPosition()[0], this.getPosition()[1]];
    let bulletRotation = this.aim_rotation.getValue() + (Math.random() * dispersion - dispersion * 0.5);

    this.getWorld().application.spawnEntity(new PlasmaProjectileEntity({ ownerUuid: this.getUuid(), position: bulletPosition, worldId: this.getWorld().getId(), rotation: bulletRotation }));
    this.attackCooldown = this.attackCooldownMax;
  }
}

export default HumanEntity;