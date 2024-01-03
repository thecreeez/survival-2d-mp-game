import SharedData from "../SharedData.js";
import Entity from "./Entity.js";

class ItemEntity extends Entity {
  item_id = new SharedData("item_id", SharedData.STR_T, "air")
  count = new SharedData("count", SharedData.NUM_T, 1)

  // CLIENT-SIDE ONLY
  swingTime = 0.5

  constructor(item_id = "air", count = 1, pos = [0,0]) {
    super("item_entity", pos)
    this.item_id.setValue(item_id);
    this.count.setValue(count);
  }
}

export default ItemEntity;