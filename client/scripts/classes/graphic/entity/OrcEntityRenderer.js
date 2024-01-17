import OrcEntity from "/core/world/entity/OrcEntity.js";
import LivingEntityRenderer from "./LivingEntityRenderer.js";
import CLIENT_INSTANCE from "../../../init.js";

class OrcEntityRenderer extends LivingEntityRenderer {
  static Entity = OrcEntity;
  static size = [150, 150];

  static idleSpeed = 200;
  static walkSpeed = 200;
  static hurtSpeed = 100;
  static attackSpeed = 50;

  static renderMain(ctx, entity) {
    super.renderMain(ctx, entity);
  }

  static renderDebug(ctx, entity) {
    super.renderDebug(ctx, entity);

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

