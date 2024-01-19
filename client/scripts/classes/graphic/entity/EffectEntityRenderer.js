import EffectSpawnerEntity from "/core/world/entity/EffectSpawnerEntity.js";
import EntityRenderer from "./EntityRenderer.js";
import MapRenderer from "../MapRenderer.js";

class EffectSpawnerEntityRenderer extends EntityRenderer {
  static Entity = EffectSpawnerEntity;
  static size = [MapRenderer.cellSize, MapRenderer.cellSize];

  static renderMain(ctx, entity) {
    super.renderMain(ctx, entity);
    //ctx.drawImage(this.FireSpriteSheet.get(entity.currentSprite,0), entity.getPosition()[0] - this.size[0] / 2, entity.getPosition()[1] - this.size[1] / 2, this.size[0], this.size[1]);
  }

  static renderDebug(ctx, entity) {
    super.renderDebug(ctx, entity);
  }
}

export default EffectEntityRenderer;