import PackAssetsRegistry from "../../registry/PackAssetsRegistry.js";
import MathUtils from "../../../../../core/utils/MathUtils.js";

class EntityRenderer {
  static Entity = null;

  static render({ctx, entity, debugMode = false}) {
    this.renderMain({ctx, entity});

    if (debugMode)
      this.renderDebug({ctx, entity});
  }

  static renderMain({ctx, entity}) {
    
  }

  static renderDebug({ctx, entity}) {
    if (entity.getSize) {
      ctx.strokeStyle = `rgba(100,100,100,0.3)`;
      ctx.strokeRect(entity.getPosition()[0] - entity.getSize()[0] / 2, entity.getPosition()[1] - entity.getSize()[1], entity.getSize()[0], entity.getSize()[1])
    }
  }

  static renderOnScreen({ctx, pos, entityData}) {
    let entity = new this.Entity(entityData);
    entity.position.setValue([pos[0] + entity.getSize()[0] / 2, pos[1] + entity.getSize()[1]]);

    this.renderMain({
      ctx, 
      entity, 
      renderHealthBar: false,
      renderName: false
    });
  }

  static isCollideWithEntity({ entity, position }) {
    let boundsWidth = [entity.getPosition()[0] - entity.getSize()[0] / 2, entity.getPosition()[0] + entity.getSize()[0] / 2];
    let boundsHeight = [entity.getPosition()[1] - entity.getSize()[1], entity.getPosition()[1]];

    if (boundsWidth[0] > position[0]) {
      return false;
    }

    if (boundsWidth[1] < position[0]) {
      return false;
    }

    if (boundsHeight[0] > position[1]) {
      return false;
    }

    if (boundsHeight[1] < position[1]) {
      return false;
    }

    return true;
  }

  static renderSelection({ entity, ctx }) {
    let client = entity.getWorld().application.context;
    let uiSheet = PackAssetsRegistry.getUISheet("core", "selection-cursor");

    if (client.controlsHandler.hoverEntity === entity) {
      let uiSize = entity.getSize()[0] / 4;
      let positions = [
        [entity.getPosition()[0] - entity.getSize()[0] / 2, entity.getPosition()[1] - entity.getSize()[1]],
        [entity.getPosition()[0] + entity.getSize()[0] / 2 - uiSize, entity.getPosition()[1] - entity.getSize()[1]],
        [entity.getPosition()[0] - entity.getSize()[0] / 2, entity.getPosition()[1] - uiSize],
        [entity.getPosition()[0] + entity.getSize()[0] / 2 - uiSize, entity.getPosition()[1] - uiSize],
      ]

      let selectionType = 0;

      if (client.controlsHandler.hoverEntityPinned) {
        selectionType = 2;
      }

      for (let i = 0; i < 4; i++) {
        ctx.drawImage(uiSheet.get(selectionType * 4 + i, 0), positions[i][0], positions[i][1], uiSize, uiSize);
      }

      let dataFontSize = 15;
      ctx.font = `arial ${dataFontSize}px`;

      let values = [];
      let entityObj = entity.toObject();
      for (let value in entityObj) {
        if (!client.controlsHandler.hoverEntityDataTag || value.includes(client.controlsHandler.hoverEntityDataTag)) {
          values.push([value, entityObj[value]]);
        }
      }

      let heightCenter = entity.getPosition()[1] - entity.getSize()[1] / 2 + dataFontSize / 2;
      let heightTop = heightCenter - values.length / 2 * dataFontSize;

      ctx.textAlign = "left";
      values.forEach((valueContainer, i) => {
        ctx.fillStyle = `rgba(255,255,255, ${(client.controlsHandler.hoverEntityTime - i * 50) / 50})`;
        ctx.fillText(
          `${valueContainer[0]}:${valueContainer[1]}`, 
          entity.getPosition()[0] + entity.getSize()[0], 
          heightTop + dataFontSize * i
        );
      })
    }
  }

  static updateEntity({entity, deltaTime}) {
    this.calculateDistance(entity);
  }

  static endUpdateEntity({entity, deltaTime}) {
  }

  static getSpriteSheet(entity) {
    if (!PackAssetsRegistry.packs[entity.getPackId()].textures.entities[entity.getId()][entity.getTexture()]) {
      console.error(`Can't find entity spriteset ${entity.getFullId()}`)
      return false;
    }

    return PackAssetsRegistry.packs[entity.getPackId()].textures.entities[entity.getId()][entity.getTexture()];
  }

  static calculateDistance(entity) {
    if (!entity.lastRenderedPosition) {
      entity.lastRenderedPosition = entity.getPosition();
      entity.distanceAfterLastRender = 0;
    }

    entity.distanceAfterLastRender += MathUtils.distanceBetween(entity.lastRenderedPosition, entity.getPosition());
    entity.lastRenderedPosition = entity.getPosition();
  }
}

export default EntityRenderer;