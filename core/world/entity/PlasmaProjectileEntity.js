import ProjectileEntity from "./ProjectileEntity.js";

class PlasmaProjectileEntity extends ProjectileEntity {
  static id = "plasma_projectile_entity";

  constructor({ position = [0, 0], worldId = "core:spawn", rotation = 90, maxDistance = 1000 } = {}) {
    super({ position, worldId, rotation, moveSpeed: 10, maxDistance, tags: ["light-source", "light-color:120,120,0", "light-level:5"] });
  }
}

export default PlasmaProjectileEntity;