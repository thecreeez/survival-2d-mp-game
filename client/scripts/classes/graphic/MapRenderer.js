import MathUtils from "/core/utils/MathUtils.js";
import PackAssetsRegistry from "../registry/PackAssetsRegistry.js";
import EntityRendererRegistry from "./EntityRendererRegistry.js";
import EntityRenderer from "./entity/EntityRenderer.js";
import Chunk from "/core/world/Chunk.js";

class MapRenderer {
  static tileSize = 40;
  static lightTileSize = 20;

  static maxLightLevel = 16;
  static minLightLevel = 3;

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

  static bakeChunk(chunk) {
    chunk.baked = true;

    chunk.canvas = document.createElement("canvas");
    chunk.canvas.width = Chunk.Size[0] * PackAssetsRegistry.DEFAULT_TILE_SPRITE_SIZE[0];
    chunk.canvas.height = Chunk.Size[1] * PackAssetsRegistry.DEFAULT_TILE_SPRITE_SIZE[1];

    let ctx = chunk.canvas.getContext("2d");
    ctx.fillStyle = `black`;
    ctx.fillRect(0, 0, chunk.canvas.width, chunk.canvas.height);

    for (let y = 0; y < Chunk.Size[1]; y++) {
      for (let x = 0; x < Chunk.Size[0]; x++) {
        let tile = chunk.getTile([x, y]);

        if (tile.pack === "core" && tile.sheetPos)
          ctx.drawImage(PackAssetsRegistry.getTile(tile.pack, tile.sheetPos), x * PackAssetsRegistry.DEFAULT_TILE_SPRITE_SIZE[0], y * PackAssetsRegistry.DEFAULT_TILE_SPRITE_SIZE[1]);
      }
    }

    ctx.strokeStyle = `red`;
    ctx.strokeRect(1,1,chunk.canvas.width - 1, chunk.canvas.height - 1);
  }

  static getChunksToRender(canvas, ctx, client) {
    let cameraPos = client.getPlayer().getPosition();

    let size = [canvas.width / this.tileSize / Chunk.Size[0], canvas.height / this.tileSize / Chunk.Size[1]]
    let startFrom = [Math.floor((cameraPos[0] - canvas.width / 2) / this.tileSize / Chunk.Size[0]), Math.floor((cameraPos[1] - canvas.height / 2) / this.tileSize / Chunk.Size[1])]

    let chunks = [];

    for (let y = startFrom[1]; y < startFrom[1] + size[1] + 1; y += 1) {
      for (let x = startFrom[0]; x < startFrom[0] + size[0] + 1; x += 1) {
        let screenPos = [x * this.tileSize * Chunk.Size[0], y * this.tileSize * Chunk.Size[1]]
        let chunk = client.getPlayer().getWorld().getChunk([x,y]);

        if (chunk) {
          if (!chunk.baked) {
            MapRenderer.bakeChunk(chunk)
          }

          chunks.push({
            sprite: chunk.getCanvas(),
            type: "chunk",
            screenPos,

            getPosition() {
              return [this.screenPos[0], this.screenPos[1]];
            }
          })
        }
      }
    }

    return chunks;
  }

  static getLightMap(canvas, ctx, client) {
    let cameraPos = client.getPlayer().getPosition();

    let size = [canvas.width / this.lightTileSize, canvas.height / this.lightTileSize];
    let startFrom = [Math.floor((cameraPos[0] - canvas.width / 2) / this.lightTileSize), Math.floor((cameraPos[1] - canvas.height / 2) / this.lightTileSize)];

    let lightSources = this.getLightSources(client);

    let lightMap = [];

    for (let y = startFrom[1]; y < startFrom[1] + size[1] + 1; y += 1) {
      for (let x = startFrom[0]; x < startFrom[0] + size[0] + 1; x += 1) {
        let worldPos = [x * this.lightTileSize, y * this.lightTileSize]

        let light = 0;
        let lightColor = [0, 0, 0];
        let amountOfLightColors = 0;

        lightSources.forEach((gameObject) => {          
          let lightSource = gameObject;
          let lightImpact = lightSource.lightLevel - MathUtils.getDistance(worldPos, [lightSource.getPosition()[0], lightSource.getPosition()[1] - MapRenderer.tileSize / 3]) / (MapRenderer.lightTileSize);

          if (lightImpact > light) {
            light = lightImpact;
          }

          if (lightImpact > 0 && lightSource.lightColor) {
            lightColor[0] = (lightColor[0] + (lightSource.lightColor[0] * lightImpact));
            lightColor[1] = (lightColor[1] + (lightSource.lightColor[1] * lightImpact));
            lightColor[2] = (lightColor[2] + (lightSource.lightColor[2] * lightImpact));

            amountOfLightColors++;
          }
        })

        if (amountOfLightColors > 0) {
          lightColor[0] /= amountOfLightColors;
          lightColor[1] /= amountOfLightColors;
          lightColor[2] /= amountOfLightColors;
        }

        lightMap.push({
          worldPos,
          lightColor,
          light
        })
      }
    }

    return lightMap;
  }

  static renderLightSources(ctx, lightMap) {
    lightMap.forEach((lightData) => {
      let light = lightData.light;
      let lightColor = lightData.lightColor;
      let worldPos = lightData.worldPos;

      ctx.fillStyle = `rgba(${lightColor[0] / 2}, ${lightColor[1] / 2}, ${lightColor[2] / 2},${Math.min((light / MapRenderer.maxLightLevel) - 0.2), 0.3})`;
      ctx.fillRect(worldPos[0], worldPos[1], MapRenderer.lightTileSize + 0.5, MapRenderer.lightTileSize);
    })
  }

  static renderFog(ctx, lightMap) {
    lightMap.forEach((lightData) => {
      let light = lightData.light;
      let worldPos = lightData.worldPos;

      ctx.fillStyle = `rgba(30,30,30,${1 - (Math.max(light, MapRenderer.minLightLevel) / MapRenderer.maxLightLevel)})`;
      ctx.fillRect(worldPos[0], worldPos[1], this.lightTileSize + 0.5, this.lightTileSize);
    })
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

    gameObjects.forEach((gameObject) => {
      gameObject.lightLevel = MapRenderer.maxLightLevel;
      
      gameObject.entity.getTags().forEach((tag) => {
        if (tag.startsWith("light-color:")) {
          gameObject.lightColor = tag.split(":")[1].split(",").map(num => Number(num));
        }

        if (tag.startsWith("light-level:")) {
          gameObject.lightLevel = Math.min(MapRenderer.maxLightLevel, Number(tag.split(":")[1]));
        }
      })
    })

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
      case "chunk": return this._renderChunkGameObject(ctx, gameObject, deltaTime);
      case "particle": return this._renderParticleGameObject(ctx, gameObject, deltaTime);
      case "entity": return this._renderEntityGameObject(ctx, gameObject, deltaTime);
      default: return false;
    }
  }

  static _renderChunkGameObject(ctx, gameObject, deltaTime) {
    ctx.drawImage(gameObject.sprite, gameObject.screenPos[0] - 0.5, gameObject.screenPos[1] - 0.5, MapRenderer.tileSize * Chunk.Size[0] + 1, MapRenderer.tileSize * Chunk.Size[1] + 1);
    return true;
  }

  static _renderParticleGameObject(ctx, gameObject, deltaTime) {
    let particle = gameObject.particle;

    let particleSheet = PackAssetsRegistry.getParticleSheet(particle.getPack(), particle.getId());

    if (particle.currentSprite < particleSheet.sheetSize[0]) {
      if (particle.attachedEntity) {
        particle.position.setValue(particle.attachedEntity.getPosition());
      }

      if (particle.lastRenderUpdate) {
        deltaTime = Date.now() - particle.lastRenderUpdate;
      }

      ctx.drawImage(particleSheet.get(particle.currentSprite, 0), particle.getPosition()[0] - particle.getSize()[0] / 2, particle.getPosition()[1] - particle.getSize()[1], particle.getSize()[0], particle.getSize()[1]);

      particle.currentSpriteTime += deltaTime;

      if (particle.currentSpriteTime > 50) {
        particle.currentSprite++;
        particle.currentSpriteTime = 0;
      }

      particle.lastRenderUpdate = Date.now();

      return true;
    }

    return false;
  }

  static _renderEntityGameObject(ctx, gameObject, deltaTime) {
    let entity = gameObject.entity;

    if (!EntityRendererRegistry[entity.getFullId()]) {
      EntityRenderer.render(ctx, entity);
      console.error(`No Renderer file for [${entity.getFullId()}] entity.`);
      return false;
    }

    EntityRendererRegistry[entity.getFullId()].render({ctx, entity});
    EntityRendererRegistry[entity.getFullId()].updateEntity({entity, deltaTime});
    EntityRendererRegistry[entity.getFullId()].endUpdateEntity({entity, deltaTime});

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