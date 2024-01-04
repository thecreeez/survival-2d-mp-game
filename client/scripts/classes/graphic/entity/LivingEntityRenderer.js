import EntityRenderer from "./EntityRenderer.js";

class LivingEntityRenderer extends EntityRenderer {
  static Entity = null;
  static size = [300, 300];

  static renderMain(ctx, entity) {
    super.renderMain(ctx, entity);

    ctx.drawImage(this.getCurrentSprite(entity), entity.getPosition()[0] - this.size[0] / 2, entity.getPosition()[1] - this.size[1] / 2, this.size[0], this.size[1]);
    ctx.font = `15px arial`;
    ctx.fillStyle = `white`;
    //ctx.fillText(entity.getState(), entity.getPosition()[0], entity.getPosition()[1] - this.size[1] / 2);
  }

  static renderDebug(ctx, entity) {
    //super.renderDebug(ctx, entity);

    ctx.fillStyle = `yellow`
    ctx.fillText(`${entity.getPosition()}`, entity.getPosition()[0], entity.getPosition()[1] - this.size[1] / 2)
  }
}

export default LivingEntityRenderer;