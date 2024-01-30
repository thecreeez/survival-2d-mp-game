class EntityRendererRegistry {
  static register(rendererClass) {
    this[rendererClass.Entity.empty().getFullId()] = rendererClass;
  }
}

export default EntityRendererRegistry