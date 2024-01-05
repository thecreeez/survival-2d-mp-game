import EffectEntity from "/core/world/entity/EffectEntity.js";
import EntityRenderer from "./EntityRenderer.js";
import SpriteSheet from "../SpriteSheet.js";
import MapRenderer from "../MapRenderer.js";

class EffectEntityRenderer extends EntityRenderer {
  static Entity = EffectEntity;
  static size = [MapRenderer.cellSize, MapRenderer.cellSize];

  static FireSpriteSheet = new SpriteSheet({
    path: `/client/assets/default/${this.Entity.empty().getType()}/fire/loop_blue.png`,
    sheetSize: [4,1],
    spriteSize: [8,8]
  })

  static renderMain(ctx, entity) {
    super.renderMain(ctx, entity);
    ctx.drawImage(this.FireSpriteSheet.get(entity.currentSprite,0), entity.getPosition()[0] - this.size[0] / 2, entity.getPosition()[1] - this.size[1] / 2, this.size[0], this.size[1]);
  }

  static renderDebug(ctx, entity) {
    super.renderDebug(ctx, entity);
  }

  static updateEntity(entity, deltaTime) {
    super.updateEntity(entity, deltaTime);
    entity.currentSpriteTime += deltaTime;

    if (100 < entity.currentSpriteTime) {
      entity.currentSprite++;
      entity.currentSpriteTime = 0;

      if (entity.currentSprite >= this.FireSpriteSheet.sheetSize[0]) {
        entity.currentSprite = 0;
      }
    }
  }
}

export default EffectEntityRenderer;