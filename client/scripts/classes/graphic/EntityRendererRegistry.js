class EntityRendererRegistry {
  static register(rendererClass) {
    this[rendererClass.Entity.id] = rendererClass;
  }
}

export default EntityRendererRegistry