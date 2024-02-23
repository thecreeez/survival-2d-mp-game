import SharedData from "../../SharedData.js";
import Entity from "./Entity.js";
import Particle from "../Particle.js";

import ParticleSpawnPacket from "../../packets/ParticleSpawnPacket.js";

class LivingEntity extends Entity {
  health = new SharedData("health", SharedData.NUM_T, 100);
  hurt_time = new SharedData("hurt_time", SharedData.NUM_T, 0);
  move_speed = new SharedData("move_speed", SharedData.NUM_T, 1);

  state = new SharedData("state", SharedData.STR_T, "idle");
  rotation = new SharedData("rotation", SharedData.NUM_T, 0);
  direction = new SharedData("direction", SharedData.POS_T, [0, 0]).makeImportant();

  attack_range = new SharedData("attack_range", SharedData.NUM_T, 20);
  view_range = new SharedData("view_range", SharedData.NUM_T, 1000);
  damage = new SharedData("damage", SharedData.NUM_T, 1);

  b_alive = new SharedData("b_alive", SharedData.BUL_T, true);

  effects = new SharedData("effects", SharedData.JSN_T, []);
  ai_data = new SharedData("ai_data", SharedData.JSN_T, {});

  // SERVER
  lastTimeMove = 0;
  attackCooldownMax = 400;
  attackCooldown = 0;
  timeToDead = 1000;

  // Client
  currentSprite = 0;
  currentSpriteTime = 0;

  constructor({ health = 100, worldId = "core:spawn", position = [0, 0], customTexture = "default", moveSpeed = 1, attackRange = 20, viewRange = 200, damage = 1, states = ["idle"], tags = [], ai = null } = {}) {
    super({ position, customTexture, worldId, tags });

    this.health.setValue(health);
    this.move_speed.setValue(moveSpeed);
    this.attack_range.setValue(attackRange);
    this.view_range.setValue(viewRange);
    this.damage.setValue(damage);

    this.ai = ai;

    if (this.ai) {
      this.ai.entity = this;
    }

    this.states = states;
    this.maxHealth = health;
  }

  updateServerTick(application, deltaTick) {
    this.updateServerState(application, deltaTick);
    this.updateServerMovement(application, deltaTick);
    this.updateServerRotation(application, deltaTick);

    if (this.ai) {
      this.ai.updateServerTick(application, deltaTick);
    }
  }

  updateServerMovement(application, deltaTick) {
    if (this.canMove(application) && (this.getDirection()[0] != 0 || this.getDirection()[1] != 0)) {
      let newPosition = [
        this.getPosition()[0] + this.getDirection()[0] * this.move_speed.getValue() * (deltaTick / 1000), 
        this.getPosition()[1] + this.getDirection()[1] * this.move_speed.getValue() * (deltaTick / 1000)
      ];

      // FIND WAY TO MOVE IT ONLY 1 POS IF HE CANT MOVE
      if (!this.canBeMovedTo(newPosition)) {
        return;
      }

      this.position.setValue(newPosition);
      this.lastTimeMove = Date.now();
    }
  }

  updateServerRotation(application, deltaTick) {
    if (!this.canRotate(application)) {
      return;
    }

    if (this.getDirection()[0] > 0) {
      this.rotation.setValue(0);
    }

    if (this.getDirection()[0] < 0) {
      this.rotation.setValue(1);
    }
  }

  updateServerState(application, deltaTick) {
    if (this.getState() != "dead" && this.b_alive.getValue() == false) {
      this.setState("dead");
      this.timeToDead = 1000;
    }

    if (this.getState() == "dead") {
      this.timeToDead -= deltaTick;

      if (this.timeToDead < 0) {
        application.removeEntity(this.getUuid());
      }
      return;
    }

    if (this.hurt_time.getValue() > 0) {
      this.hurt_time.setValue(this.hurt_time.getValue() - deltaTick);
    }

    if (this.getTimeAfterLastMove() > 50 && this.getState() == "walk") {
      this.setState("idle");
    }

    if (this.getTimeAfterLastMove() < 50 && this.getState() == "idle") {
      this.setState("walk");
    }

    if (this.getState() == "hurt" && this.hurt_time.getValue() <= 0) {
      this.setState("idle");
    }

    if (this.ai) {
      if (this.ai.currentTarget && this.distanceTo(this.ai.currentTarget) < this.attack_range.getValue() && this.getState() != "attack") {
        this.setState("attack");
      }

      if (!this.ai.currentTarget && this.getState() == "attack") {
        this.setState("idle");
      }

      if (this.ai.currentTarget && this.distanceTo(this.ai.currentTarget) > this.attack_range.getValue() && this.getState() == "attack") {
        this.setState("idle");
      }
    }
  }

  handleDamage(entity, damage) {
    if (!this.b_alive.getValue()) {
      return false;
    }

    this.hurt_time.setValue(400);
    this.setState("hurt");
    this.health.setValue(this.health.getValue() - damage);

    let entitySize = 40;

    if (!this.getWorld().application.isClient()) {
      ParticleSpawnPacket.serverSend(
        this.getWorld().application.context, 
        this.getWorld().application.context.getPlayersConnections(), 
        { particle: new Particle({ pack: "core", particleType: "hit-sparks", worldId: this.getWorld().getId(), position: [this.getPosition()[0], this.getPosition()[1] - entitySize / 2] }) }
      );
    }

    if (this.ai) {
      this.ai.handleDamage(entity);
    }

    if (this.getHealth() <= 0) {
      this.b_alive.setValue(false);
      this.health.setValue(0);
    }

    if (!entity) {
      return true;
    }

    return true;
  }

  setState(state) {
    if (this.states.indexOf(state) == -1) {
      console.error(`Can't set state [${state}]. Not provided in states`)
      return false;
    }

    this.state.setValue(state);
  }

  getState() {
    return this.state.getValue();
  }

  getStateId() {
    return this.states.indexOf(this.getState());
  }

  getHealth() {
    return this.health.getValue();
  }

  getMaxHealth() {
    if (this.maxHealth < this.getHealth()) {
      this.maxHealth = this.getHealth();
    }

    return this.maxHealth;
  }

  getDirection() {
    return this.direction.getValue();
  }

  setDirection(x, y) {
    this.direction.setValue([x, y]);
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
    return this.b_alive.getValue();
  }

  canAttack(entity) {
    if (entity.isDead()) {
      return false;
    }

    if (this.distanceTo(entity) > this.attack_range.getValue()) {
      return false;
    }

    if (!entity.health) {
      return false;
    }

    if (entity.hurt_time.getValue() > 0) {
      return false;
    }

    return true;
  }

  canShoot() {
    return this.b_alive.getValue();
  }

  canRotate(application) {
    return this.b_alive.getValue();
  }

  isDead() {
    return !this.b_alive.getValue();
  }

  getAIData() {
    return this.ai_data;
  }

  getViewDistance() {
    return this.view_range.getValue();
  }

  getAttackRange() {
    return this.attack_range.getValue();
  }

  getMoveSpeed() {
    return this.move_speed.getValue();
  }
}

export default LivingEntity;