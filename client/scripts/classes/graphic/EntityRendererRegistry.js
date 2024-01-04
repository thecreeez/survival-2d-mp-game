class EntityRendererRegistry {
  static register(rendererClass) {
    this[rendererClass.Entity.empty().getType()] = rendererClass;
  }
}

export default EntityRendererRegistry