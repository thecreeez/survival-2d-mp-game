import Screen from "../Screen.js";
import SpriteSheet from "./SpriteSheet.js";

class MapRenderer {
  static cellSize = 40;

  static Tiles = new SpriteSheet({ 
    path: `/client/assets/textures/tiles/tileset.png`,
    spriteSize: [8,8],
    sheetSize: [23, 14]
  })

  /**
   * spriteSheet: new SpriteSheet({
        path: `/client/assets/textures/${entity.getType()}/${name}.png`,
        sheetSize,
        spriteSize
      }),
   */

  static render(canvas, ctx, client) {
    let cameraPos = client.getPlayer().getPosition();

    let size = [canvas.width / this.cellSize, canvas.height / this.cellSize]
    let startFrom = [Math.floor((cameraPos[0] - canvas.width / 2) / this.cellSize), Math.floor((cameraPos[1] - canvas.height / 2) / this.cellSize)]

    ctx.strokeStyle = `black`;
    for (let y = startFrom[1]; y < startFrom[1] + size[1] + 1; y += 1) {
      for (let x = startFrom[0]; x < startFrom[0] + size[0] + 1; x += 1) {
        let cellPos = [x * this.cellSize, y * this.cellSize]
        //ctx.strokeRect(cellPos[0], cellPos[1], this.cellSize, this.cellSize);

        

        if (x % 2 == 0) {
          ctx.drawImage(this.Tiles.get(15, 2), cellPos[0], cellPos[1], this.cellSize, this.cellSize)
        } else {
          ctx.drawImage(this.Tiles.get(13, 2), cellPos[0], cellPos[1], this.cellSize, this.cellSize)
        }

        if (x == 4) {
          ctx.drawImage(this.Tiles.get(6, 2), cellPos[0], cellPos[1], this.cellSize, this.cellSize)
        }

        if (x == 5) {
          ctx.drawImage(this.Tiles.get(7, 2), cellPos[0], cellPos[1], this.cellSize, this.cellSize)
        }

        if (x == 6) {
          ctx.drawImage(this.Tiles.get(8, 2), cellPos[0], cellPos[1], this.cellSize, this.cellSize)
        }
        //ctx.fillStyle = `black`;
        //ctx.fillText(`${x},${y}`, cellPos[0] + 3, cellPos[1] + 10);
      }
    }
  }

  static getPos(cameraPos, pos) {
    return [cameraPos[0] - pos[0]]
  }
}

export default MapRenderer;