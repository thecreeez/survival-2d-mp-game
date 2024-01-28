import LivingEntityRenderer from "./LivingEntityRenderer.js";


class HumanEntityRenderer extends LivingEntityRenderer {
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

  static renderMain({ ctx, entity, renderHealthBar }) {
    super.renderMain({ ctx, entity, renderHealthBar });

    ctx.font = `15px arial`;
    ctx.textAlign = `center`;
    ctx.fillStyle = `white`;
    
    if (entity.getMessage()) {
      ctx.fillText(entity.getMessage(), entity.getPosition()[0], entity.getPosition()[1] - this.size[1] - 15)
    }
  }

  static renderDebug({ ctx, entity }) {
    super.renderDebug({ ctx, entity });
  }
}

export default HumanEntityRenderer;