import ProjectileEntity from "./ProjectileEntity.js";

class PlasmaProjectileEntity extends ProjectileEntity {
  static id = "plasma_projectile_entity";
  static size = [20,20];

  constructor({ ownerUuid = "world", position = [0, 0], worldId = "core:spawn", rotation = 90 } = {}) {
    super({ ownerUuid, damage: 5, position, worldId, rotation, moveSpeed: 40 * 15, maxDistance: 40 * 10, tags: ["light-source", "light-color:120,120,0", "light-level:3"] });
  }

  onCollide(application, entity) {
    if (this.getOwner() == entity) {
      return;
    }

    if (!entity.handleDamage) {
      return;
    }

    let handleSuccess = entity.handleDamage(this, this.damage.getValue());

    if (handleSuccess) {
      this.getWorld().application.removeEntity(this.getUuid());
    }
  }
}

export default PlasmaProjectileEntity;