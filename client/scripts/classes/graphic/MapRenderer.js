import MathUtils from "/core/utils/MathUtils.js";
import PackAssetsRegistry from "../registry/PackAssetsRegistry.js";
import EntityRendererRegistry from "./EntityRendererRegistry.js";
import EntityRenderer from "./entity/EntityRenderer.js";

class MapRenderer {
  static tileSize = 40;
  static lightTileSize = 40;

  static maxLightLevel = 4;

  static getEntitiesToRender(canvas, ctx, client) {

    let gameObjects = [];

    let nearEntities = client.application.getEntities().filter((entity) => entity.distanceTo(client.getPlayer()) < Math.max(canvas.width / 2, canvas.height / 2));

    nearEntities.forEach((entity) => {
      gameObjects.push({
        entity,
        type: "entity",

        getPosition() {
          return this.entity.getPosition();
        }
      })
    })

    return gameObjects;
  }

  static getTilesToRender(canvas, ctx, client) {
    let cameraPos = client.getPlayer().getPosition();

    let size = [canvas.width / this.tileSize, canvas.height / this.tileSize]
    let startFrom = [Math.floor((cameraPos[0] - canvas.width / 2) / this.tileSize), Math.floor((cameraPos[1] - canvas.height / 2) / this.tileSize)]

    let tiles = [];

    for (let y = startFrom[1]; y < startFrom[1] + size[1] + 1; y += 1) {
      for (let x = startFrom[0]; x < startFrom[0] + size[0] + 1; x += 1) {
        let screenPos = [x * this.tileSize, y * this.tileSize]
        let tile = client.getTileAt(x, y);

        if (tile) {
          tiles.push({
            sprite: PackAssetsRegistry.getTile(tile.pack, tile),
            type: "tile",
            screenPos,

            getPosition() {
              return [this.screenPos[0], this.screenPos[1]];
            }
          })
        }
      }
    }

    return tiles;
  }

  static renderLightTiles(canvas, ctx, client) {
    let cameraPos = client.getPlayer().getPosition();

    let size = [canvas.width / this.lightTileSize, canvas.height / this.lightTileSize];
    let startFrom = [Math.floor((cameraPos[0] - canvas.width / 2) / this.lightTileSize), Math.floor((cameraPos[1] - canvas.height / 2) / this.lightTileSize)];

    let lightSources = this.getLightSources(client);

    for (let y = startFrom[1]; y < startFrom[1] + size[1] + 1; y += 1) {
      for (let x = startFrom[0]; x < startFrom[0] + size[0] + 1; x += 1) {
        let worldPos = [x * this.lightTileSize, y * this.lightTileSize]
        
        let light = 0;

        lightSources.forEach((gameObject) => {
          let lightSource = gameObject;
          let lightImpact = MapRenderer.maxLightLevel - MathUtils.getDistance(worldPos, [lightSource.getPosition()[0] - MapRenderer.tileSize / 2, lightSource.getPosition()[1] - MapRenderer.tileSize / 2]) / MapRenderer.lightTileSize;

          if (lightImpact > light) {
            light = lightImpact;
          }
        })
        ctx.fillStyle = `rgba(0,0,0,${1 - (light / MapRenderer.maxLightLevel)})`;

        ctx.fillRect(worldPos[0], worldPos[1], this.lightTileSize + 0.5, this.lightTileSize + 0.2);
      }
    }
  }

  static getLightLevel(client, worldPos) {
    let cameraPos = client.getPlayer().getPosition();
    return MathUtils.getDistance(worldPos, [cameraPos[0] - 20, cameraPos[1] - 20]) / 300;
  }

  static getLightSources(client) {
    let canvas = document.querySelector("canvas");

    let gameObjects = this.getEntitiesToRender(canvas, canvas.getContext("2d"), client);

    // All props with light-source tag;
    gameObjects = gameObjects.filter(gameObject => gameObject.entity.getTags().indexOf("light-source") != -1);

    return gameObjects;
  }

  static getParticlesToRender(world) {
    let gameObjects = [];

    world.getParticles().forEach((particle) => {
      gameObjects.push({
        particle,
        type: "particle",
        screenPos: particle.getPosition(),

        getPosition() {
          return [this.screenPos[0], this.screenPos[1]];
        }
      })
    })

    let canvas = document.querySelector("canvas");

    return gameObjects.filter((gameObject) => MathUtils.distanceBetween(gameObject.getPosition(), world.application.context.getPlayer().getPosition()) < Math.max(canvas.width / 2, canvas.height / 2));
  }

  static renderGameObject(ctx, gameObject, deltaTime) {
    switch (gameObject.type) {
      case "tile": return this._renderTileGameObject(ctx, gameObject, deltaTime);
      case "particle": return this._renderParticleGameObject(ctx, gameObject, deltaTime);
      case "entity": return this._renderEntityGameObject(ctx, gameObject, deltaTime);
      default: return false;
    }
  }

  static _renderTileGameObject(ctx, gameObject, deltaTime) {
    ctx.drawImage(gameObject.sprite, gameObject.screenPos[0], gameObject.screenPos[1], MapRenderer.tileSize, MapRenderer.tileSize);
    return true;
  }

  static _renderParticleGameObject(ctx, gameObject, deltaTime) {
    let particle = gameObject.particle;

    let particleSheet = PackAssetsRegistry.getParticleSheet(particle.getPack(), particle.getId());

    if (particle.currentSprite < particleSheet.sheetSize[0]) {
      if (particle.attachedEntity) {
        particle.position.setValue(particle.attachedEntity.getPosition());
      }

      ctx.drawImage(particleSheet.get(particle.currentSprite, 0), particle.getPosition()[0] - particle.getSize()[0] / 2, particle.getPosition()[1] - particle.getSize()[1], particle.getSize()[0], particle.getSize()[1]);
      particle.currentSpriteTime += deltaTime;;

      if (particle.currentSpriteTime > 50) {
        particle.currentSprite++;
        particle.currentSpriteTime = 0;
      }

      return true;
    }

    return false;
  }

  static _renderEntityGameObject(ctx, gameObject, deltaTime) {
    let entity = gameObject.entity;

    if (!EntityRendererRegistry[entity.getId()]) {
      EntityRenderer.render(ctx, entity);
      console.error(`No Renderer file for [${entity.getFullId()}] entity.`);
      return false;
    }

    EntityRendererRegistry[entity.getId()].render(ctx, entity);
    EntityRendererRegistry[entity.getId()].updateEntity(entity, deltaTime);
    EntityRendererRegistry[entity.getId()].endUpdateEntity(entity, deltaTime);

    return true;
  }

  static renderFloor(ctx, size, startFrom) {
    ctx.strokeStyle = `black`;
    for (let y = startFrom[1]; y < startFrom[1] + size[1] + 1; y += 1) {
      for (let x = startFrom[0]; x < startFrom[0] + size[0] + 1; x += 1) {
        let cellPos = [x * this.tileSize, y * this.tileSize]

        ctx.strokeRect(cellPos[0], cellPos[1], this.tileSize, this.tileSize);

        ctx.font = `10px arial`
        ctx.fillStyle = `black`;
        ctx.textAlign = "left";
        ctx.fillText(`${x},${y}`, cellPos[0] + 3, cellPos[1] + 10);
      }
    }
  }
}

export default MapRenderer;