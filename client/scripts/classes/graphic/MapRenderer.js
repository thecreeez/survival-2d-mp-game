import PackAssetsRegistry from "../registry/PackAssetsRegistry.js";
import EntityRendererRegistry from "./EntityRendererRegistry.js";
import EntityRenderer from "./entity/EntityRenderer.js";

class MapRenderer {
  static tileSize = 40;

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

  static renderGameObject(ctx, gameObject, deltaTime) {
    if (gameObject.type === "tile") {
      ctx.drawImage(gameObject.sprite, gameObject.screenPos[0], gameObject.screenPos[1], MapRenderer.tileSize, MapRenderer.tileSize)
    } else if (gameObject.type === "particle") {
      
    } else {
      let entity = gameObject;

      if (EntityRendererRegistry[entity.getId()]) {
        EntityRendererRegistry[entity.getId()].render(ctx, entity);
        EntityRendererRegistry[entity.getId()].updateEntity(entity, deltaTime);
        return;
      }

      EntityRenderer.render(ctx, entity);
      console.error(`Entity ${entity.getUuid()} ${entity.getId()} can't be rendered. Renderer has not be set.`);
    }
  }

  static render(canvas, ctx, client) {
    let cameraPos = client.getPlayer().getPosition();

    let size = [canvas.width / this.tileSize, canvas.height / this.tileSize]
    let startFrom = [Math.floor((cameraPos[0] - canvas.width / 2) / this.tileSize), Math.floor((cameraPos[1] - canvas.height / 2) / this.tileSize)]

    this.renderFloor(ctx, size, startFrom)

    for (let y = startFrom[1]; y < startFrom[1] + size[1] + 1; y += 1) {
      for (let x = startFrom[0]; x < startFrom[0] + size[0] + 1; x += 1) {
        let cellPos = [x * this.tileSize, y * this.tileSize]
        let tile = client.getTileAt(x, y);

        if (tile) {
          ctx.drawImage(PackAssetsRegistry.packs[tile.pack].textures.tileset.get(tile[0], tile[1]), cellPos[0], cellPos[1], this.tileSize, this.tileSize)
        }
      }
    }
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