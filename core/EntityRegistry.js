class EntityRegistry {
  static register(entityClass) {
    this[new entityClass().getType()] = entityClass;
  }
}

export default EntityRegistry;