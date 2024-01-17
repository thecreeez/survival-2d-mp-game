import ItemEntity from "/core/world/entity/ItemEntity.js";
import EntityRenderer from "./EntityRenderer.js";
import MapRenderer from "../MapRenderer.js";

class ItemEntityRenderer extends EntityRenderer {
  static Entity = ItemEntity;
  static size = [MapRenderer.cellSize, MapRenderer.cellSize];

  static showed = false;

  static renderMain(ctx, entity) {
    super.renderMain(ctx, entity);
    ctx.drawImage(this.ItemSpriteSheet.get(entity.getItem().spritePos[0], entity.getItem().spritePos[1]), entity.getPosition()[0] - this.size[0] / 2, entity.getPosition()[1] - this.size[1] / 2 - entity.spriteUp, this.size[0], this.size[1]);
  }

  static renderDebug(ctx, entity) {
    super.renderDebug(ctx, entity);
  }

  static updateEntity(entity, deltaTime) {
    super.updateEntity(entity, deltaTime);

    if (entity.bSpriteUp) {
      entity.spriteUp += 0.125;

      if (entity.spriteUp > entity.maxSpriteUp) {
        entity.bSpriteUp = false;
        entity.spriteUp = entity.maxSpriteUp;
      }
    } else {
      entity.spriteUp -= 0.125;

      if (entity.spriteUp < 0) {
        entity.bSpriteUp = true;
        entity.spriteUp = 0;
      }
    }
  }
}

export default ItemEntityRenderer;