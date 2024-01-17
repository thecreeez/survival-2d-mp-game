import LivingEntityRenderer from "./LivingEntityRenderer.js";
import PlayerEntity from "/core/world/entity/PlayerEntity.js";

class PlayerEntityRenderer extends LivingEntityRenderer {
  static Entity = PlayerEntity;
  static size = [150, 150];
  
  static idleSpeed = 200;
  static walkSpeed = 200;
  static hurtSpeed = 100;
  static attackSpeed = 50;

  static renderMain(ctx, entity) {
    super.renderMain(ctx, entity);

    ctx.font = `15px arial`;
    ctx.textAlign = `center`;
    ctx.fillStyle = `white`;
    ctx.fillText(entity.getName(), entity.getPosition()[0], entity.getPosition()[1] - this.size[1] / 4 - 15)
  }

  static renderDebug(ctx, entity) {
    super.renderDebug(ctx, entity);

    let pos = [entity.getPosition()[0], entity.getPosition()[1] - entity.getAttackRange()];
    let size = [entity.getAttackRange(), entity.getAttackRange() * 2];

    ctx.strokeStyle = `black`;
    if (entity.getLookingSide() == `left`) {
      pos[0] -= entity.getAttackRange();
    }
    
    ctx.strokeRect(pos[0], pos[1], size[0], size[1])
    ctx.fillText(entity.getState(), entity.getPosition()[0], entity.getPosition()[1] - this.size[1] / 4 - 30)
  }
}

export default PlayerEntityRenderer;