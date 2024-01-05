import Item from "./world/Item.js";

class ItemRegistry {
  static register(item) {
    this[item.getId()] = item;
  }

  static air = new Item();
}

export default ItemRegistry;