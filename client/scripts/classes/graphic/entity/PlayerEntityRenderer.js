import HumanEntityRenderer from "./HumanEntityRenderer.js";
import PlayerEntity from "/core/world/entity/PlayerEntity.js";

class PlayerEntityRenderer extends HumanEntityRenderer {
  static Entity = PlayerEntity;

  static renderMain({ ctx, entity, renderHealthBar }) {
    super.renderMain({ ctx, entity, renderHealthBar });

    ctx.font = `15px arial`;
    ctx.textAlign = `center`;
    ctx.fillStyle = `white`;

    let offset = 15;

    if (entity.getMessage()) {
      offset += 15;
    }
    
    ctx.fillText(entity.getName(), entity.getPosition()[0], entity.getPosition()[1] - entity.getSize()[1] - offset)
  }

  static renderDebug({ ctx, entity }) {
    super.renderDebug({ ctx, entity });
  }
}

export default PlayerEntityRenderer;