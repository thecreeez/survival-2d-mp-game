import EntityRenderer from "./EntityRenderer.js";
import SpriteSheet from "../SpriteSheet.js";

class LivingEntityRenderer extends EntityRenderer {
  static Entity = null;
  static size = [300, 300];

  static renderMain(ctx, entity) {
    super.renderMain(ctx, entity);

    ctx.drawImage(this.getCurrentSprite(entity), entity.getPosition()[0] - this.size[0] / 2, entity.getPosition()[1] - this.size[1] / 2, this.size[0], this.size[1]);
    ctx.font = `15px arial`;
    ctx.fillStyle = `white`;
    //ctx.fillText(entity.getState(), entity.getPosition()[0], entity.getPosition()[1] - this.size[1] / 2);
  }

  static renderDebug(ctx, entity) {
    //super.renderDebug(ctx, entity);

    ctx.font = `15px arial`;
    ctx.fillStyle = `white`
    ctx.textAlign = "center";
    ctx.fillText(`[${entity.getPosition()}]`, entity.getPosition()[0], entity.getPosition()[1] - this.size[1] / 4)
  }

  static updateEntity(entity, deltaTime) {
    super.updateEntity(entity, deltaTime);
    entity.currentSpriteTime += deltaTime;

    let state = this.getState(entity);

    if (state.frameDuration < entity.currentSpriteTime) {
      entity.currentSprite++;
      entity.currentSpriteTime = 0;

      if (entity.currentSprite >= state.spriteSheet.sheetSize[0]) {
        entity.currentSprite = 0;
      }
    }
  }

  static registerState(name, spriteSize, sheetSize, frameDuration) {
    if (!this.Entity) {
      console.error(`Entity renderer doesnt have entity.`)
      return false;
    }

    let entity = this.Entity.empty();

    this[`${name}State`] = {
      spriteSheet: new SpriteSheet({
        path: `/client/assets/default/${entity.getId()}/${name}.png`,
        sheetSize,
        spriteSize
      }),
      frameDuration
    }

    return this[`${name}State`];
  }

  static getCurrentSprite(entity) {
    let state = this.getState(entity);
    if (entity.currentSprite >= state.spriteSheet.sheetSize[0]) {
      entity.currentSprite = 0;
    }

    return state.spriteSheet.get(entity.currentSprite, entity.getRotation());
  }

  static getState(entity) {
    let state = this[`${entity.getState()}State`];

    if (!state) {
      state = this[`idleState`];
    }

    return state;
  }
}

export default LivingEntityRenderer;