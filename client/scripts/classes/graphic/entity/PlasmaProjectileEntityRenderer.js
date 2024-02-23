import PlasmaProjectileEntity from "/core/world/entity/PlasmaProjectileEntity.js";
import EntityRenderer from "./EntityRenderer.js";
import Particle from "/core/world/Particle.js";

class PlasmaProjectileEntityRenderer extends EntityRenderer {
  static Entity = PlasmaProjectileEntity;
  static size = [20, 20];

  static spriteTime = 100;

  static renderMain({ctx, entity}) {
    if (!this.getSpriteSheet(entity)) {
      return;
    }

    ctx.drawImage(this.getSpriteSheet(entity).get(entity.currentSprite,0), entity.getPosition()[0] - entity.getSize()[0] / 2, entity.getPosition()[1] - entity.getSize()[1], entity.getSize()[0], entity.getSize()[1]);
  }

  static renderDebug({ctx, entity}) {
    super.renderDebug({ctx, entity});

    let center = [entity.getPosition()[0], entity.getPosition()[1] - entity.getSize()[1] / 2]

    ctx.strokeStyle = `red`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(center[0], center[1]);
    ctx.lineTo(center[0] + entity.getDirection()[0] * (entity.getMoveSpeed() / 20), center[1] + entity.getDirection()[1] * (entity.getMoveSpeed() / 20));
    ctx.stroke();
  }

  static updateEntity({entity, deltaTime}) {
    super.updateEntity({entity, deltaTime});

    if (entity.lastTimeRendered) {
      deltaTime = Date.now() - entity.lastTimeRendered;
    }

    entity.currentSpriteTime += deltaTime;
    entity.lastTimeRendered = Date.now();

    if (entity.distanceAfterLastRender > entity.getSize()[0] / 2) {
      entity.getWorld().spawnParticle(new Particle({ pack: "core", worldId: entity.getWorld().getId(), position: entity.lastRenderedPosition, lifeTime: 2000, particleType: "smoke", size: [20,20] }));
      entity.distanceAfterLastRender = 0;
    }

    if (entity.currentSpriteTime >= PlasmaProjectileEntityRenderer.spriteTime && entity.currentSprite < this.getSpriteSheet(entity).sheetSize[0]) {
      entity.currentSprite++;
      entity.currentSpriteTime = 0;

      if (entity.currentSprite >= this.getSpriteSheet(entity).sheetSize[0]) {
        entity.currentSprite--;
      }
    }
  }
}

export default PlasmaProjectileEntityRenderer;