import ItemEntity from "/core/world/entity/ItemEntity.js";
import EntityRenderer from "./EntityRenderer.js";

class ItemEntityRenderer extends EntityRenderer {
  static Entity = ItemEntity;

  static showed = false;

  static renderMain({ctx, entity}) {
    super.renderMain({ctx, entity});
    ctx.drawImage(this.ItemSpriteSheet.get(entity.getItem().spritePos[0], entity.getItem().spritePos[1]), entity.getPosition()[0] - entity.getSize()[0] / 2, entity.getPosition()[1] - entity.getSize()[1] / 2 - entity.spriteUp, entity.getSize()[0], entity.getSize()[1]);
  }

  static renderDebug({ctx, entity}) {
    super.renderDebug({ctx, entity});
  }

  static updateEntity({entity, deltaTime}) {
    super.updateEntity({entity, deltaTime});

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