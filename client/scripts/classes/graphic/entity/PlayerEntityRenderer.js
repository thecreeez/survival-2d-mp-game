import LivingEntityRenderer from "./LivingEntityRenderer.js";
import PlayerEntity from "/core/world/entity/PlayerEntity.js";

class PlayerEntityRenderer extends LivingEntityRenderer {
  static Entity = PlayerEntity;
  static Type = "friend";
  
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

  static renderMain(ctx, entity) {
    super.renderMain(ctx, entity);

    ctx.font = `15px arial`;
    ctx.textAlign = `center`;
    ctx.fillStyle = `white`;
    ctx.fillText(entity.getName(), entity.getPosition()[0], entity.getPosition()[1] - this.size[1] - 15)
  }

  static renderDebug(ctx, entity) {
    super.renderDebug(ctx, entity);

    //let pos = [entity.getPosition()[0], entity.getPosition()[1] - entity.getAttackRange()];
    //let size = [entity.getAttackRange(), entity.getAttackRange() * 2];
//
    //ctx.strokeStyle = `black`;
    //if (entity.getLookingSide() == `left`) {
    //  pos[0] -= entity.getAttackRange();
    //}
    //
    //ctx.strokeRect(pos[0], pos[1], size[0], size[1])
  }
}

export default PlayerEntityRenderer;