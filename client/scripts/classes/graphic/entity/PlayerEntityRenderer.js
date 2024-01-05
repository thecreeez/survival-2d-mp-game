import LivingEntityRenderer from "./LivingEntityRenderer.js";
import PlayerEntity from "/core/world/entity/PlayerEntity.js";

class PlayerEntityRenderer extends LivingEntityRenderer {
  static Entity = PlayerEntity;
  static size = [150, 150];
  
  static idleAnimation = this.registerState("idle", [32,32], [16,4], 200);
  static walkAnimation = this.registerState("walk", [32,32], [4,4], 200);
  static hurtAnimation = this.registerState("hurt", [32, 32], [4,4], 100);

  static renderMain(ctx, entity) {
    super.renderMain(ctx, entity);
    ctx.font = `15px arial`;
    ctx.fillStyle = `white`;
    //ctx.fillText(entity.getState(), entity.getPosition()[0], entity.getPosition()[1] - this.size[1] / 2);
  }
}

export default PlayerEntityRenderer;