import ItemEntity from "/core/entity/ItemEntity.js";
import EntityRenderer from "./EntityRenderer.js";

class ItemEntityRenderer extends EntityRenderer {
  static Entity = ItemEntity;
  static size = [100, 100];

  static renderMain(ctx, entity) {
    super.renderMain(ctx, entity);
  }

  static renderDebug(ctx, entity) {
    super.renderMain(ctx, entity);
  }
}

export default ItemEntityRenderer;