import OrcEntity from "/core/world/entity/OrcEntity.js";
import LivingEntityRenderer from "./LivingEntityRenderer.js";
import CLIENT_INSTANCE from "../../../init.js";

class OrcEntityRenderer extends LivingEntityRenderer {
  static Entity = OrcEntity;
  static size = [150, 150];

  static idleAnimation = this.registerState("idle", [32, 32], [16, 4], 200);
  static walkAnimation = this.registerState("walk", [32, 32], [4, 4], 200);
  static attackAnimation = this.registerState("attack", [32, 32], [4, 4], 100);
  static hurtAnimation = this.registerState("hurt", [32, 32], [4, 4], 100);

  static renderMain(ctx, entity) {
    super.renderMain(ctx, entity);
  }

  static renderDebug(ctx, entity) {
    //super.renderDebug(ctx, entity);

    ctx.fillStyle = `yellow`
    ctx.fillText(`${entity.getState()}`, entity.getPosition()[0], entity.getPosition()[1] - this.size[1] / 2)

    ctx.strokeStyle = `black`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(entity.getPosition()[0], entity.getPosition()[1], entity.target_vision_range.getValue(), 0, Math.PI * 2);
    ctx.stroke();

    if (entity.wannaMove(CLIENT_INSTANCE.application)) {
      let targetPos = entity.target_pos.getValue();
      if (entity.getTargetEntity(CLIENT_INSTANCE.application)) {
        targetPos = entity.getTargetEntity(CLIENT_INSTANCE.application).getPosition();
      }

      ctx.beginPath();
      ctx.moveTo(entity.getPosition()[0], entity.getPosition()[1]);
      ctx.lineTo(targetPos[0], targetPos[1]);
      ctx.stroke();
    }
  }
}

export default OrcEntityRenderer;

