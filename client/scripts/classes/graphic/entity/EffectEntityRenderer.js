import EffectSpawnerEntity from "/core/world/entity/EffectSpawnerEntity.js";
import EntityRenderer from "./EntityRenderer.js";
import MapRenderer from "../MapRenderer.js";

class EffectSpawnerEntityRenderer extends EntityRenderer {
  static Entity = EffectSpawnerEntity;
  static size = [MapRenderer.cellSize, MapRenderer.cellSize];

  static renderMain({ctx, entity}) {
    super.renderMain({ctx, entity});
    //ctx.drawImage(this.FireSpriteSheet.get(entity.currentSprite,0), entity.getPosition()[0] - entity.getSize()[0] / 2, entity.getPosition()[1] - entity.getSize()[1] / 2, entity.getSize()[0], entity.getSize()[1]);
  }

  static renderDebug({ctx, entity}) {
    super.renderDebug({ctx, entity});
  }
}

export default EffectEntityRenderer;