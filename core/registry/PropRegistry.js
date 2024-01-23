import Registry from "../utils/Registry.js";

class PropRegistry extends Registry {
  static register(pack, id, spriteSize = [1,1], worldSize = [40,40]) {
    this[`${pack}:${id}`] = {
      spriteSize,
      worldSize
    };
  }
}