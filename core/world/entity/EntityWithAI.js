import SharedData from "../../SharedData.js";
import LivingEntity from "./LivingEntity.js";

class EntityWithAI extends LivingEntity {
  target_uuid = new SharedData("target_uuid", SharedData.STR_T, "no_target")
  target_pos = new SharedData("target_pos", SharedData.POS_T, [0,0])
  target_exist = new SharedData("target_exist", SharedData.BUL_T, false)
  target_class = new SharedData("target_class", SharedData.STR_T, "player_entity")
  target_tag = new SharedData("target_tag", SharedData.STR_T, "human")
  target_vision_range = new SharedData("target_vision_range", SharedData.NUM_T, 500);

  constructor({ worldId = "core:spawn", position = [0, 0], health = 100, damage = 5, moveSpeed = 2, attackRange = 50, visionRange = 500, target_tag = "human", target_class = "core:player_entity", states = [] } = {}) {
    super({
      position,
      worldId,
      health,
      damage,
      moveSpeed,
      attackRange,
      states
    });

    this.target_class.setValue(target_class);
    this.target_tag.setValue(target_tag);
    
    this.target_pos.setValue([...position]);
    this.target_vision_range.setValue(visionRange);
  }

  /**
   * 
   * @param {Application} application 
   */
  updateServerTick(application, deltaTick) {
    super.updateServerTick(application, deltaTick);

    if (!this.b_alive.getValue()) {
      return;
    }

    this.updateTarget(application);
    this.updateAttack(application);
    this.updateDirection(application);

    if (this.getTargetEntity(application) && this.distanceTo(this.getTargetEntity(application)) < this.attack_range.getValue() && this.getState() != "attack") {
      this.setState("attack");
    }

    if (!this.getTargetEntity(application) && this.getState() == "attack") {
      this.setState("idle");
    }

    if (this.getTargetEntity(application) && this.distanceTo(this.getTargetEntity(application)) > this.attack_range.getValue() && this.getState() == "attack") {
      this.setState("idle");
    }
  }

  /**
   * 
   * @param {Application} application 
   */
  updateTarget(application) {
    if (!this.target_exist.getValue()) {
      let possibleTarget = null;

      application.getEntities().filter((otherEntity) => {
        // Чтоб сам себя не убивал
        if (otherEntity == this)
          return;

        // Если сущность не того типа и не имеет нужного тэга
        if (this.target_class.getValue() != otherEntity.getFullId() && otherEntity.getTags().indexOf(this.target_tag.getValue()) == -1)
          return;

        // Если сущность слишком далеко
        if (this.distanceTo(otherEntity) > this.target_vision_range.getValue())
          return;

        if (otherEntity.isDead())
          return;

        possibleTarget = otherEntity;
      })

      if (possibleTarget) {
        this.target_exist.setValue(true);
        this.target_uuid.setValue(possibleTarget.getUuid());
        this.target_pos.setValue([...possibleTarget.getPosition()]);
      }
      return;
    }

    let targetEntity = application.getEntity(this.target_uuid.getValue());

    if (!targetEntity) {
      this.target_exist.setValue(false);
      this.target_uuid.setValue("no_target");
      return;
    }

    if (this.distanceTo(targetEntity) > this.target_vision_range.getValue()) {
      this.target_exist.setValue(false);
      this.target_uuid.setValue("no_target");
      return;
    }

    if (targetEntity.isDead()) {
      this.target_exist.setValue(false);
      this.target_uuid.setValue("no_target");
      return;
    }

    this.target_pos.setValue([...targetEntity.getPosition()]);
  }

  /**
   * 
   * @param {Application} application 
   */
  updateDirection(application) {
    if (!this.wannaMove(application)) {
      this.setDirection(0,0);
      return;sd
    }

    let targetEntity = this.getTargetEntity(application);
    let targetPosition = [...this.target_pos.getValue()];

    if (targetEntity) {
      targetPosition = targetEntity.position.getValue();
    }
    
    let entityPosition = this.position.getValue();

    let moving = [0,0];

    if (entityPosition[1] < targetPosition[1]) {
      moving[1] = this.move_speed.getValue();
    };

    if (entityPosition[1] > targetPosition[1]) {
      moving[1] = -this.move_speed.getValue();
    }

    if (entityPosition[0] < targetPosition[0]) {
      moving[0] = this.move_speed.getValue();
    }

    if (entityPosition[0] > targetPosition[0]) {
      moving[0] = -this.move_speed.getValue();
    }

    if (moving[0] != 0 && moving[1] != 0) {
      moving[0] /= 2;
      moving[1] /= 2;
    }

    if (moving[0] == this.direction.getValue()[0] && moving[1] == this.direction.getValue()[1]) {
      return;
    }

    this.direction.setValue(moving);
  }

  updateAttack(application) {
    let targetEntity = this.getTargetEntity(application);

    if (!targetEntity) {
      return;
    }

    if (!this.canAttack(targetEntity)) {
      return;
    }

    this.rotation.setValue(targetEntity.getPosition()[0] > this.getPosition()[0] ? 0 : 1);
    targetEntity.handleDamage(this, this.damage.getValue());
  }

  getTargetEntity(application) {
    return application.getEntity(this.target_uuid.getValue());
  }

  wannaMove(application) {
    // Достаточно близко чтоб бить
    if (this.target_exist.getValue() && this.distanceTo(this.getTargetEntity(application)) < this.attack_range.getValue()) {
      return false;
    }

    return this.target_exist.getValue() || (this.target_pos.getValue()[0] != this.position.getValue()[0] || this.target_pos.getValue()[1] != this.position.getValue()[1]);
  }

  canAttack(entity) {
    if (entity.isDead()) {
      return false;
    }

    if (this.distanceTo(entity) > this.attack_range.getValue()) {
      return false
    }

    if (!entity.health) {
      return false;
    }

    if (entity.hurt_time.getValue() > 0) {
      return false;
    }

    return true;
  }
}

export default EntityWithAI;