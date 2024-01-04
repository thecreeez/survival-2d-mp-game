import SpriteSheet from "../SpriteSheet.js";

class EntityRenderer {
  static Entity = null;

  static render(ctx, entity) {
    this.renderMain(ctx, entity);
    this.renderDebug(ctx, entity);
  }

  static renderMain(ctx, entity) {

  }

  static renderDebug(ctx, entity) {
    ctx.strokeRect(entity.getPosition()[0] - this.size[0] / 2, entity.getPosition()[1] - this.size[1] / 2, this.size[0], this.size[1])
  }

  static updateEntity(entity, deltaTime) {
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
        path: `/client/assets/textures/${entity.getType()}/${name}.png`,
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

export default EntityRenderer;