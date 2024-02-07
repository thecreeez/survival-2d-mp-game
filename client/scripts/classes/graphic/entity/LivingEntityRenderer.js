import MathUtils from "../../../../../core/utils/MathUtils.js";
import Client from "../../Client.js";
import PackAssetsRegistry from "../../registry/PackAssetsRegistry.js";
import EntityRenderer from "./EntityRenderer.js";

class LivingEntityRenderer extends EntityRenderer {
  static Entity = null;
  static size = [50, 50];

  static healthBarCanvas = document.createElement("canvas");

  static renderMain({ ctx, entity, renderHealthBar = true }) {
    super.renderMain({ ctx, entity });
    if (!this.getCurrentSprite(entity)) {
      return;
    }
    ctx.drawImage(this.getCurrentSprite(entity), entity.getPosition()[0] - this.size[0] / 2, entity.getPosition()[1] - this.size[1], this.size[0], this.size[1]);
    ctx.font = `15px arial`;
    ctx.fillStyle = `white`;

    if (renderHealthBar) {
      this.renderHealthBar({ ctx, entity });
    }
  }

  static isCollideWithEntity({ entity, position}) {
    let boundsWidth = [entity.getPosition()[0] - this.size[0] / 2, entity.getPosition()[0] + this.size[0] / 2];
    let boundsHeight = [entity.getPosition()[1] - this.size[1], entity.getPosition()[1]];

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

    if (this.isCollideWithEntity({ entity, position: mousePos, ctx })) {
      let uiSize = this.size[0] / 4;

      for (let i = 0; i < 4; i++) {
        let positions = [
          [entity.getPosition()[0] - this.size[0] / 2, entity.getPosition()[1] - this.size[1]],
          [entity.getPosition()[0] + this.size[0] / 2 - uiSize, entity.getPosition()[1] - this.size[1]],
          [entity.getPosition()[0] - this.size[0] / 2, entity.getPosition()[1] - uiSize],
          [entity.getPosition()[0] + this.size[0] / 2 - uiSize, entity.getPosition()[1] - uiSize],
        ]
        ctx.drawImage(uiSheet.get(i, 0), positions[i][0], positions[i][1], uiSize, uiSize);
      }
    }
  }

  static renderDebug({ ctx, entity }) {
    super.renderDebug({ ctx, entity });
  }

  static updateEntity({ entity, deltaTime }) {
    super.updateEntity({ entity, deltaTime });
    this.updateState(entity);
  }

  static endUpdateEntity({ entity, deltaTime }) {
    let stateData = this[entity.getState()];

    if (entity.currentSprite >= stateData.sprites && !stateData.repeatable) {
      return;
    }

    if (entity.lastRenderUpdate) {
      deltaTime = Date.now() - entity.lastRenderUpdate;
    }

    let updateSprite = () => {
      entity.currentSprite++;
      entity.currentSpriteTime = 0;
      entity.distanceAfterLastRender = 0;

      if (entity.currentSprite >= stateData.sprites) {
        if (stateData.repeatable) {
          entity.currentSprite = 0;
        } else {
          entity.currentSprite--;
        }
      }
    }

    entity.currentSpriteTime += deltaTime;

    if (!stateData.durationType || stateData.durationType == "time") {
      if (stateData.spriteDuration < entity.currentSpriteTime) {
        updateSprite();
      }
    }

    if (stateData.durationType == "distance") {
      if (stateData.spriteDuration < entity.distanceAfterLastRender) {
        updateSprite();
      }
    }

    entity.lastRenderUpdate = Date.now();
  }

  static updateState(entity) {
    if (entity.lastRenderedState != entity.getState()) {
      entity.currentSprite = 0;
    }
    entity.lastRenderedState = entity.getState();
  }

  static getCurrentSprite(entity) {
    let spriteSheet = this.getSpriteSheet(entity);
    if (entity.currentSprite >= spriteSheet.sheetSize[0]) {
      entity.currentSprite = 0;
    }

    let flipped = entity.getRotation() == 1;

    return spriteSheet.get(entity.currentSprite, entity.getStateId(), flipped);
  }

  static renderHealthBar({ ctx, entity }) {
    let healthBarBackground = this.getHealthBar(entity, false);
    ctx.drawImage(healthBarBackground, entity.getPosition()[0] - healthBarBackground.width * 0.75, entity.getPosition()[1] - this.size[1] * 1.2, healthBarBackground.width * 1.5, healthBarBackground.height * 1.5);

    let healthBarFull = this.getHealthBar(entity, true);

    this.healthBarCanvas.width = healthBarBackground.width;
    this.healthBarCanvas.height = healthBarBackground.height;
    let healthBarContext = this.healthBarCanvas.getContext("2d");

    let hpModifier = entity.getHealth() / entity.getMaxHealth();

    healthBarContext.clearRect(0, 0, healthBarFull.width, healthBarFull.height);
    healthBarContext.drawImage(healthBarFull, 0, 0);
    healthBarContext.clearRect(healthBarFull.width * hpModifier, 0, healthBarFull.width, healthBarFull.height);

    ctx.drawImage(this.healthBarCanvas, entity.getPosition()[0] - healthBarBackground.width * 0.75, entity.getPosition()[1] - this.size[1] * 1.2, healthBarBackground.width * 1.5, healthBarBackground.height * 1.5);
  }

  static getHealthBar(entity, bFilled = false) {
    let height = bFilled ? 1 : 0;

    switch (this.getEntityType(entity)) {
      case "friend": return PackAssetsRegistry.getUISheet("core", "health-bars").get(0, height);
      case "enemy": return PackAssetsRegistry.getUISheet("core", "health-bars").get(2, height);
      default: return PackAssetsRegistry.getUISheet("core", "health-bars").get(1, height);
    }
  }

  static getEntityType(entity) {
    if (entity === Client.instance.getPlayer()) {
      return "friend";
    }

    if (entity.getLeaderName && entity.getLeaderName() === Client.instance.getPlayer().getName()) {
      return "friend";
    }

    if (entity.haveTag("hostile")) {
      return "enemy";
    }

    return "neutral";
  }
}

export default LivingEntityRenderer;