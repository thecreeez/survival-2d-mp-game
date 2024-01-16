import Registry from "../utils/Registry.js";
import Item from "../world/Item.js";

class ItemRegistry extends Registry {
  static "core:air" = new Item();
}

export default ItemRegistry