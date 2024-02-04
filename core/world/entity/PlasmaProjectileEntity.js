import ProjectileEntity from "./ProjectileEntity.js";

class PlasmaProjectileEntity extends ProjectileEntity {
  static id = "plasma_projectile_entity";
  static size = [20,20];

  constructor({ ownerUuid = "world", position = [0, 0], worldId = "core:spawn", rotation = 90, maxDistance = 1000 } = {}) {
    super({ ownerUuid, damage: 5, position, worldId, rotation, moveSpeed: 10, maxDistance, tags: ["light-source", "light-color:120,120,0", "light-level:3"] });
  }

  onCollide(application, entity) {
    if (this.getOwner() == entity) {
      return;
    }

    if (!entity.handleDamage) {
      return;
    }

    let handleSuccess = entity.handleDamage(this.getOwner(), this.damage.getValue());

    if (handleSuccess) {
      //let direction = [entity.getPosition()[0] - this.getPosition()[0], entity.getPosition()[1] - this.getPosition()[1]]
      //entity.position.setValue([entity.getPosition()[0] + direction[0] / 5, entity.getPosition()[1] + direction[1] / 5]);
      
      this.getWorld().application.removeEntity(this.getUuid());
    }
  }
}

export default PlasmaProjectileEntity;