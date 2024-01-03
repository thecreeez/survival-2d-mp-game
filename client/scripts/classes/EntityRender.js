import CLIENT_INSTANCE from "../init.js";

class EntityWithAIRender {
  static render(ctx, entityWithAI) {
    ctx.fillStyle = `black`;
    ctx.fillRect(entityWithAI.getPosition()[0] - 15, entityWithAI.getPosition()[1] - 15, 30, 30);

    ctx.strokeStyle = `black`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(entityWithAI.getPosition()[0], entityWithAI.getPosition()[1], entityWithAI.target_vision_range.getValue(), 0, Math.PI * 2);
    ctx.stroke();

    if (entityWithAI.wannaMove()) {
      let targetPos = entityWithAI.target_pos.getValue();
      if (entityWithAI.getTargetEntity(CLIENT_INSTANCE.application)) {
        targetPos = entityWithAI.getTargetEntity(CLIENT_INSTANCE.application).getPosition();
      }

      ctx.beginPath();
      ctx.moveTo(entityWithAI.getPosition()[0], entityWithAI.getPosition()[1]);
      ctx.lineTo(targetPos[0], targetPos[1]);
      ctx.stroke();
    }

    ctx.font = `15px arial`;
    ctx.fillText(entityWithAI.health.getValue(), entityWithAI.getPosition()[0], entityWithAI.getPosition()[1] - 20);
  }
}

export default EntityWithAIRender;