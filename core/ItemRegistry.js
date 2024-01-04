class ItemRegistry {
  static register(item) {
    this[item.getId()] = item;
  }
}

export default ItemRegistry;