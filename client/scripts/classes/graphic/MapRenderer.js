import PackAssetsRegistry from "../registry/PackAssetsRegistry.js";
import Screen from "./Screen.js";

class MapRenderer {
  static cellSize = 40;

  static getTilesToRender(canvas, ctx, client) {
    let cameraPos = client.getPlayer().getPosition();

    let size = [canvas.width / this.cellSize, canvas.height / this.cellSize]
    let startFrom = [Math.floor((cameraPos[0] - canvas.width / 2) / this.cellSize), Math.floor((cameraPos[1] - canvas.height / 2) / this.cellSize)]

    let tiles = [];

    for (let y = startFrom[1]; y < startFrom[1] + size[1] + 1; y += 1) {
      for (let x = startFrom[0]; x < startFrom[0] + size[0] + 1; x += 1) {
        let screenPos = [x * this.cellSize, y * this.cellSize]
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

  static render(canvas, ctx, client) {
    let cameraPos = client.getPlayer().getPosition();

    let size = [canvas.width / this.cellSize, canvas.height / this.cellSize]
    let startFrom = [Math.floor((cameraPos[0] - canvas.width / 2) / this.cellSize), Math.floor((cameraPos[1] - canvas.height / 2) / this.cellSize)]

    this.renderFloor(ctx, size, startFrom)

    for (let y = startFrom[1]; y < startFrom[1] + size[1] + 1; y += 1) {
      for (let x = startFrom[0]; x < startFrom[0] + size[0] + 1; x += 1) {
        let cellPos = [x * this.cellSize, y * this.cellSize]
        let tile = client.getTileAt(x, y);

        if (tile) {
          ctx.drawImage(PackAssetsRegistry.packs[tile.pack].textures.tileset.get(tile[0], tile[1]), cellPos[0], cellPos[1], this.cellSize, this.cellSize)
        }
      }
    }
  }

  static renderFloor(ctx, size, startFrom) {
    ctx.strokeStyle = `black`;
    for (let y = startFrom[1]; y < startFrom[1] + size[1] + 1; y += 1) {
      for (let x = startFrom[0]; x < startFrom[0] + size[0] + 1; x += 1) {
        let cellPos = [x * this.cellSize, y * this.cellSize]

        ctx.strokeRect(cellPos[0], cellPos[1], this.cellSize, this.cellSize);

        ctx.font = `10px arial`
        ctx.fillStyle = `black`;
        ctx.textAlign = "left";
        ctx.fillText(`${x},${y}`, cellPos[0] + 3, cellPos[1] + 10);
      }
    }
  }
}

export default MapRenderer;