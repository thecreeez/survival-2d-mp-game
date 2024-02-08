import PackAssetsRegistry from "../../registry/PackAssetsRegistry.js";
import MathUtils from "../../../../../core/utils/MathUtils.js";
import MapRenderer from "../MapRenderer.js";

class EntityRenderer {
  static Entity = null;

  static render({ctx, entity}) {
    this.renderMain({ctx, entity});
    this.renderSelection({ ctx, entity });
    //this.renderDebug(ctx, entity);
  }

  static renderMain({ctx, entity}) {
    
  }

  static renderDebug({ctx, entity}) {
    if (entity.getSize()) {
      ctx.strokeStyle = `black`;
      ctx.strokeRect(entity.getPosition()[0] - entity.getSize()[0] / 2, entity.getPosition()[1] - entity.getSize()[1], entity.getSize()[0], entity.getSize()[1])
    }

    ctx.fillStyle = `red`
    ctx.beginPath();
    ctx.arc(entity.getPosition()[0], entity.getPosition()[1], 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = `15px arial`;
    ctx.fillStyle = `white`
    ctx.textAlign = "center";
    ctx.fillText(`[${entity.getPosition()}]`, entity.getPosition()[0], entity.getPosition()[1] - entity.getSize()[1])
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
    let mousePos = client.getScreen().getMousePosOnWorld(client);

    let uiSheet = PackAssetsRegistry.getUISheet("core", "selection-cursor");

    if (this.isCollideWithEntity({ entity, position: mousePos })) {
      let uiSize = entity.getSize()[0] / 4;

      for (let i = 0; i < 4; i++) {
        let positions = [
          [entity.getPosition()[0] - entity.getSize()[0] / 2, entity.getPosition()[1] - entity.getSize()[1]],
          [entity.getPosition()[0] + entity.getSize()[0] / 2 - uiSize, entity.getPosition()[1] - entity.getSize()[1]],
          [entity.getPosition()[0] - entity.getSize()[0] / 2, entity.getPosition()[1] - uiSize],
          [entity.getPosition()[0] + entity.getSize()[0] / 2 - uiSize, entity.getPosition()[1] - uiSize],
        ]
        ctx.drawImage(uiSheet.get(i, 0), positions[i][0], positions[i][1], uiSize, uiSize);
      }
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