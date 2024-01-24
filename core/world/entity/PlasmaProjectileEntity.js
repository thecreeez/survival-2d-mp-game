import ProjectileEntity from "./ProjectileEntity.js";

class PlasmaProjectileEntity extends ProjectileEntity {
  static id = "plasma_projectile_entity";

  constructor({ position = [0, 0], worldId = "core:spawn", rotation = 90, maxDistance = 1000 } = {}) {
    super({ position, worldId, rotation, moveSpeed: 10, maxDistance, tags: ["light-source"] });
  }
}

export default PlasmaProjectileEntity;