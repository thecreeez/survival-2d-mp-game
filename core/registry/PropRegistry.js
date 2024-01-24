import Registry from "../utils/Registry.js";

class PropRegistry extends Registry {
  static register(pack, id, worldSize = [40,40], haveCollision = false) {
    this[`${pack}:${id}`] = {
      spriteSize,
      worldSize
    };
  }
}