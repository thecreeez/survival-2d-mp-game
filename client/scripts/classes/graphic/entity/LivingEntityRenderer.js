import MathUtils from "../../../../../core/utils/MathUtils.js";
import PackAssetsRegistry from "../../registry/PackAssetsRegistry.js";
import EntityRenderer from "./EntityRenderer.js";

class LivingEntityRenderer extends EntityRenderer {
  static Entity = null;
  static size = [40, 40];

  static renderMain(ctx, entity) {
    if (!this.getCurrentSprite(entity)) {
      return;
    }
    ctx.drawImage(this.getCurrentSprite(entity), entity.getPosition()[0] - this.size[0] / 2, entity.getPosition()[1] - this.size[1], this.size[0], this.size[1]);
    ctx.font = `15px arial`;
    ctx.fillStyle = `white`;

    let healthBar = this.getHealthBar();

    ctx.drawImage(healthBar, entity.getPosition()[0] - healthBar.width / 2, entity.getPosition()[1] - this.size[1] * 1.2, healthBar.width, healthBar.height);
  }

  static renderDebug(ctx, entity) {
    super.renderDebug(ctx, entity);
  }

  static updateEntity(entity, deltaTime) {
    super.updateEntity(entity, deltaTime);
    this.updateState(entity);
  }

  static endUpdateEntity(entity, deltaTime) {
    let stateData = this[entity.getState()];

    if (entity.currentSprite >= stateData.sprites && !stateData.repeatable) {
      return;
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

  static getHealthBar() {
    switch (this.Type) {
      case "friend": return PackAssetsRegistry.getUISheet("core", "health-bars").get(0, 0);
      case "enemy": return PackAssetsRegistry.getUISheet("core", "health-bars").get(2, 0);
      default: return PackAssetsRegistry.getUISheet("core", "health-bars").get(1, 0);
    }
  }
}

export default LivingEntityRenderer;