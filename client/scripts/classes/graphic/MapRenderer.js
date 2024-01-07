import Screen from "./Screen.js";
import SpriteSheet from "./SpriteSheet.js";
import TileSetData from "./TileSetData.js";

class MapRenderer {
  static cellSize = 40;

  static defaultTiles = new SpriteSheet({ 
    path: `/client/assets/default/tileset.png`,
    spriteSize: [8,8],
    sheetSize: [23, 14]
  })

  static defaultTileSetData = new TileSetData(this.defaultTiles)
    .setRenderStep(13, 5, TileSetData.RenderSteps.top)
    .setRenderStep(14, 5, TileSetData.RenderSteps.top)
    .setRenderStep(15, 5, TileSetData.RenderSteps.top)

  static forestTiles = new SpriteSheet({
    path: `/client/assets/forest/tileset.png`,
    spriteSize: [8, 8],
    sheetSize: [69, 23]
  })

  static defaultTileSetData = new TileSetData(this.defaultTiles)
    .setRenderStep(13, 5, TileSetData.RenderSteps.top)
    .setRenderStep(14, 5, TileSetData.RenderSteps.top)
    .setRenderStep(15, 5, TileSetData.RenderSteps.top)

  static forestTileSetData = new TileSetData(this.forestTiles)
    //.addAnimationFrame(25, 3, 29, 3)
    //.addAnimationFrame(25, 4, 29, 4)
    //.addAnimationFrame(25, 5, 29, 5)
    //.addAnimationFrame(26, 3, 30, 3)
    //.addAnimationFrame(26, 4, 30, 4)
    //.addAnimationFrame(26, 5, 30, 5)
    //.addAnimationFrame(27, 3, 31, 3)
    //.addAnimationFrame(27, 4, 31, 4)
    //.addAnimationFrame(27, 5, 31, 5)

  static render(canvas, ctx, client, type) {
    let cameraPos = client.getPlayer().getPosition();

    let size = [canvas.width / this.cellSize, canvas.height / this.cellSize]
    let startFrom = [Math.floor((cameraPos[0] - canvas.width / 2) / this.cellSize), Math.floor((cameraPos[1] - canvas.height / 2) / this.cellSize)]

    if (type == TileSetData.RenderSteps.floor) {
      this.renderFloor(ctx, size, startFrom)
    }

    for (let y = startFrom[1]; y < startFrom[1] + size[1] + 1; y += 1) {
      for (let x = startFrom[0]; x < startFrom[0] + size[0] + 1; x += 1) {
        let cellPos = [x * this.cellSize, y * this.cellSize]
        let tile = client.getTileAt(x, y);

        if (tile && this[`${tile.pack}TileSetData`].getRenderStep(tile[0], tile[1]) == type) {
          ctx.drawImage(this[`${tile.pack}Tiles`].get(tile[0], tile[1]), cellPos[0], cellPos[1], this.cellSize, this.cellSize)
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