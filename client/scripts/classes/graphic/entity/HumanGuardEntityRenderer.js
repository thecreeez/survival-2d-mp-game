import LivingEntityRenderer from "./LivingEntityRenderer.js";
import HumanGuardEntity from "/core/world/entity/HumanGuardEntity.js";

class HumanGuardEntityRenderer extends LivingEntityRenderer {
  static Entity = HumanGuardEntity;

  static idle = {
    spriteDuration: 800,
    sprites: 2,
    repeatable: true
  }

  static walk = {
    spriteDuration: 10,
    durationType: "distance",
    sprites: 2,
    repeatable: true
  }

  static crawl = {
    spriteDuration: 10,
    durationType: "distance",
    sprites: 2,
    repeatable: false
  }

  static attack = {
    spriteDuration: 100,
    sprites: 2,
    repeatable: true
  }

  static hurt = {
    spriteDuration: 100,
    sprites: 3,
    repeatable: false
  }

  static dead = {
    spriteDuration: 100,
    sprites: 5,
    repeatable: false
  }

  static throw = {
    spriteDuration: 100,
    sprites: 3,
    repeatable: false
  }
}

export default HumanGuardEntityRenderer;