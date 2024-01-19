import PlasmaProjectileEntity from "/core/world/entity/PlasmaProjectileEntity.js";
import EntityRenderer from "./EntityRenderer.js";

class PlasmaProjectileEntityRenderer extends EntityRenderer {
  static Entity = PlasmaProjectileEntity;
  static size = [20, 20];

  static spriteTime = 50;

  static renderMain(ctx, entity) {
    if (!this.getSpriteSheet(entity)) {
      return;
    }

    ctx.drawImage(this.getSpriteSheet(entity).get(entity.currentSprite,0), entity.getPosition()[0] - this.size[0] / 2, entity.getPosition()[1] - this.size[1], this.size[0], this.size[1]);
  }

  static renderDebug(ctx, entity) {
    super.renderDebug(ctx, entity);
  }

  static updateEntity(entity, deltaTime) {
    entity.currentSpriteTime += deltaTime;

    if (entity.currentSpriteTime >= PlasmaProjectileEntityRenderer.spriteTime && entity.currentSprite < this.getSpriteSheet(entity).sheetSize[0]) {
      entity.currentSprite++;
      entity.currentSpriteTime = 0;

      if (entity.currentSprite >= this.getSpriteSheet(entity).sheetSize[0]) {
        entity.currentSprite--;
      }
    }
  }
}

export default PlasmaProjectileEntityRenderer;