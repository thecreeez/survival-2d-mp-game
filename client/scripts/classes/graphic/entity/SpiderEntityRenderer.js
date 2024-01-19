import SpiderEntity from "/core/world/entity/SpiderEntity.js";
import LivingEntityRenderer from "./LivingEntityRenderer.js";

class SpiderEntityRenderer extends LivingEntityRenderer {
  static Entity = SpiderEntity;

  static idle = {
    spriteDuration: 800,
    sprites: 2,
    repeatable: true
  }

  static walk = {
    spriteDuration: 5,
    durationType: "distance",
    sprites: 4,
    repeatable: true
  }

  static hurt = {
    spriteDuration: 100,
    sprites: 2,
    repeatable: false
  }

  static attack = {
    spriteDuration: 100,
    sprites: 5,
    repeatable: true
  }

  static dead = {
    spriteDuration: 100,
    sprites: 1,
    repeatable: false
  }
}

export default SpiderEntityRenderer;