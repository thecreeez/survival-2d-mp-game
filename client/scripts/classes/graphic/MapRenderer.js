import PackAssetsRegistry from "../registry/PackAssetsRegistry.js";

class MapRenderer {
  static cellSize = 40;

  static RenderSteps = {
    floor: 0,
    wall: 1,
    top: 2
  }

  static render(canvas, ctx, client, renderStep) {
    let cameraPos = client.getPlayer().getPosition();

    let size = [canvas.width / this.cellSize, canvas.height / this.cellSize]
    let startFrom = [Math.floor((cameraPos[0] - canvas.width / 2) / this.cellSize), Math.floor((cameraPos[1] - canvas.height / 2) / this.cellSize)]

    if (renderStep == this.RenderSteps.floor) {
      this.renderFloor(ctx, size, startFrom)
    }

    for (let y = startFrom[1]; y < startFrom[1] + size[1] + 1; y += 1) {
      for (let x = startFrom[0]; x < startFrom[0] + size[0] + 1; x += 1) {
        let cellPos = [x * this.cellSize, y * this.cellSize]
        let tile = client.getTileAt(x, y);

        if (tile) {
          let tileRenderStep = client.application.getPack(tile.pack).tilesetData[`${tile[0]}:${tile[1]}`];

          if (!tileRenderStep) {
            tileRenderStep = 0;
          }

          if (tile && renderStep === tileRenderStep) {
            ctx.drawImage(PackAssetsRegistry.packs[tile.pack].textures.tileset.get(tile[0], tile[1]), cellPos[0], cellPos[1], this.cellSize, this.cellSize)
          }
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