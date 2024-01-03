import SharedData from "../SharedData.js";
import LivingEntity from "./LivingEntity.js";

class EntityWithAI extends LivingEntity {
  move_speed = new SharedData("move_speed", SharedData.NUM_T, 1);

  target_uuid = new SharedData("target_uuid", SharedData.STR_T, "no_target")
  target_pos = new SharedData("target_pos", SharedData.POS_T, [0,0])
  target_exist = new SharedData("target_exist", SharedData.BUL_T, false)
  target_type = new SharedData("target_type", SharedData.STR_T, "player_entity")
  target_vision_range = new SharedData("target_vision_range", SharedData.NUM_T, 500);

  damage = new SharedData("damage", SharedData.NUM_T, 1);

  constructor(pos = [0, 0], health = 100, { target_class = "player_entity" } = {}) {
    super("entity_with_ai", health, pos)

    this.position.setValue(pos);
    this.target_type.setValue(target_class);
    this.target_pos.setValue([...pos]);
  }

  /**
   * 
   * @param {Application} application 
   */
  updateServerTick(application) {
    super.updateServerTick();

    this.updateTarget(application);
    this.updateMovement(application);
    this.updateAttack(application);
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

        // Если сущность не того типа
        if (this.target_type.getValue() != otherEntity.getType())
          return;

        // Если сущность слишком далеко
        if (this.distanceTo(otherEntity) > this.target_vision_range.getValue())
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

    this.target_pos.setValue([...targetEntity.getPosition()]);
  }

  /**
   * 
   * @param {Application} application 
   */
  updateMovement(application) {
    if (!this.wannaMove()) {
      return;
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

    this.position.setValue([entityPosition[0] + moving[0], entityPosition[1] + moving[1]]);
  }

  updateAttack(application) {
    let targetEntity = this.getTargetEntity(application);

    if (!targetEntity) {
      return;
    }

    if (!this.canAttack(targetEntity)) {
      return;
    }
    targetEntity.handleDamage(this, this.damage.getValue());
  }

  getTargetEntity(application) {
    return application.getEntity(this.target_uuid.getValue());
  }

  wannaMove() {
    return this.target_exist.getValue() || (this.target_pos.getValue()[0] != this.position.getValue()[0] || this.target_pos.getValue()[1] != this.position.getValue()[1]);
  }

  canAttack(entity) {
    if (this.distanceTo(entity) > 1) {
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