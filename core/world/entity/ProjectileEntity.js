import Entity from "./Entity.js";
import SharedData from "../../SharedData.js";
import MathUtils from "../../utils/MathUtils.js";

class ProjectileEntity extends Entity {
  direction = new SharedData("direction", SharedData.POS_T, [0,0]);
  move_speed = new SharedData("move_speed", SharedData.NUM_T, 1);
  max_distance = new SharedData("max_distance", SharedData.NUM_T, 100);

  damage = new SharedData("damage", SharedData.NUM_T, 1);

  owner_uuid = new SharedData("owner_uuid", SharedData.STR_T, "world");

  currentSprite = 0;
  currentSpriteTime = 0;

  distanceTraveled = 0;

  constructor({ ownerUuid = "world", position = [0, 0], worldId = "core:spawn", damage = 1, rotation = 90, moveSpeed = 3, maxDistance = 1000, tags = [] } = {}) {
    super({ position, worldId, tags });

    this.direction.setValue(this.getDirectionByRotation(rotation));
    this.move_speed.setValue(moveSpeed);
    this.max_distance.setValue(maxDistance);
    this.owner_uuid.setValue(ownerUuid);
    this.damage.setValue(damage);
  }

  updateServerTick(application, deltaTick) {
    super.updateServerTick(application, deltaTick);
    let newPosition = [
      this.getPosition()[0] + this.getDirection()[0] * this.move_speed.getValue() * (deltaTick / 1000),
      this.getPosition()[1] + this.getDirection()[1] * this.move_speed.getValue() * (deltaTick / 1000)
    ];
    
    if (!this.canBeMovedTo(newPosition)) {
      this.getWorld().application.removeEntity(this);
      return;
    }

    this.distanceTraveled += MathUtils.getDistance(newPosition, this.getPosition());
    this.position.setValue(newPosition);

    if (this.distanceTraveled >= this.max_distance.getValue()) {
      this.getWorld().application.removeEntity(this.getUuid());
      return;
    }
  }

  getDirectionByRotation(rotation) {
    return [
      Math.cos(MathUtils.degreesToRadians(rotation)), 
      Math.sin(MathUtils.degreesToRadians(rotation))
    ];
  }

  getDirection() {
    return this.direction.getValue();
  }

  getOwner() {
    if (this.owner_uuid.getValue() == "world") {
      return false;
    }

    return this.getWorld().application.getEntity(this.owner_uuid.getValue())
  }

  getDamage() {
    return this.damage.getValue();
  }

  getMoveSpeed() {
    return this.move_speed.getValue();
  }
}

export default ProjectileEntity;