class EntityRenderer {
  static Entity = null;

  static render(ctx, entity) {
    this.renderMain(ctx, entity);
    this.renderDebug(ctx, entity);
  }

  static renderMain(ctx, entity) {

  }

  static renderDebug(ctx, entity) {
    ctx.strokeRect(entity.getPosition()[0] - this.size[0] / 2, entity.getPosition()[1] - this.size[1] / 2, this.size[0], this.size[1])
  }

  static updateEntity(entity, deltaTime) {
    
  }
}

export default EntityRenderer;