import PackAssetsRegistry from "../../registry/PackAssetsRegistry.js";
import EntityRenderer from "./EntityRenderer.js";
import PropEntity from "/core/world/entity/PropEntity.js";

class PropEntityRenderer extends EntityRenderer {
  static Entity = PropEntity;

  static spriteTime = 50;

  static renderMain({ctx, entity}) {
    super.renderMain({ctx, entity});
    let propData = PackAssetsRegistry.getProp(entity.getPackId(), entity.getPropId(), entity.getState());

    if (!propData) {
      return;
    }

    let offset = propData.offset ? propData.offset : [0,0];
    ctx.drawImage(propData.canvas, entity.getPosition()[0] - propData.worldSize[0] / 2 + offset[0], entity.getPosition()[1] - propData.worldSize[1] + offset[1], propData.worldSize[0], propData.worldSize[1])
  }

  static renderDebug({ctx, entity}) {
    super.renderDebug({ctx, entity});
  }

  static updateEntity({entity, deltaTime}) {
    
  }
}

export default PropEntityRenderer;