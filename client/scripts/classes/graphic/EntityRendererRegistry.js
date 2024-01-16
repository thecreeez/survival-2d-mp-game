class EntityRendererRegistry {
  static register(rendererClass) {
    this[rendererClass.Entity.empty().getId()] = rendererClass;
  }
}

export default EntityRendererRegistry