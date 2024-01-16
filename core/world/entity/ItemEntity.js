import ItemRegistry from "../../registry/ItemRegistry.js";
import SharedData from "../../SharedData.js";
import Entity from "./Entity.js";

class ItemEntity extends Entity {
  static id = `item_entity`;

  item_id = new SharedData("item_id", SharedData.STR_T, "air")
  count = new SharedData("count", SharedData.NUM_T, 1)

  // CLIENT
  spriteUp = 0;
  maxSpriteUp = 10;
  bSpriteUp = true;

  constructor({ item = ItemRegistry["core:air"], count = 1, pos: position = [0,0] } = {}) {
    super({ position });

    this.item_id.setValue(item.getId());
    this.count.setValue(count);
  }

  getItem() {
    return ItemRegistry[this.item_id.getValue()];
  }
}

export default ItemEntity;