import Chunk from "/core/world/Chunk.js";
import PackAssetsRegistry from "../registry/PackAssetsRegistry.js";

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

class ChunkRenderer {
  constructor(screen) {
    this.screen = screen;

    this.tileSize = 40;
    this.lightTileSize = 20;
    this.minLightLevel = 3;
    this.maxLightLevel = 16;

    this.lastChunksRenderedSize = 0;

    this.tileGrid = document.createElement("canvas");
    this.tileGrid.width = Chunk.Size[0] * PackAssetsRegistry.DEFAULT_TILE_SPRITE_SIZE[0];
    this.tileGrid.height = Chunk.Size[1] * PackAssetsRegistry.DEFAULT_TILE_SPRITE_SIZE[1];
    let ctx = this.tileGrid.getContext("2d");

    ctx.strokeStyle = `black`;
    ctx.lineWidth = 0.5;
    for (let y = 0; y < Chunk.Size[1]; y += 1) {
      for (let x = 0; x < Chunk.Size[0]; x += 1) {
        let cellPos = [x * PackAssetsRegistry.DEFAULT_TILE_SPRITE_SIZE[0], y * PackAssetsRegistry.DEFAULT_TILE_SPRITE_SIZE[1]]

        ctx.strokeRect(cellPos[0], cellPos[1], PackAssetsRegistry.DEFAULT_TILE_SPRITE_SIZE[0], PackAssetsRegistry.DEFAULT_TILE_SPRITE_SIZE[1]);
      }
    }
  }

  render({ bRenderChunkGrid = false, bRenderTileGrid = false } = {}) {
    this._getChunksToRender().forEach(chunkHandler => {
      ctx.drawImage(chunkHandler.chunk.getCanvas(), chunkHandler.position[0], chunkHandler.position[1], this.tileSize * Chunk.Size[0], this.tileSize * Chunk.Size[1]);

      if (bRenderTileGrid) {
        ctx.drawImage(this.tileGrid, chunkHandler.position[0], chunkHandler.position[1], this.tileSize * Chunk.Size[0], this.tileSize * Chunk.Size[1]);
      }

      if (bRenderChunkGrid) {
        ctx.lineWidth = 10;
        ctx.strokeStyle = `green`;
        ctx.strokeRect(chunkHandler.position[0], chunkHandler.position[1], this.tileSize * Chunk.Size[0], this.tileSize * Chunk.Size[1]);
      }
    })
  }

  _getChunksToRender() {
    let client = this.screen.client;
    let cameraPos = client.getPlayer().getPosition();

    let size = [canvas.width / this.tileSize / Chunk.Size[0], canvas.height / this.tileSize / Chunk.Size[1]]
    let startFrom = [Math.floor((cameraPos[0] - canvas.width / 2) / this.tileSize / Chunk.Size[0]), Math.floor((cameraPos[1] - canvas.height / 2) / this.tileSize / Chunk.Size[1])]

    let chunks = [];

    for (let y = startFrom[1]; y < startFrom[1] + size[1] + 1; y += 1) {
      for (let x = startFrom[0]; x < startFrom[0] + size[0] + 1; x += 1) {
        let screenPos = [x * this.tileSize * Chunk.Size[0], y * this.tileSize * Chunk.Size[1]]
        let chunk = client.getPlayer().getWorld().getChunk([x, y]);

        if (chunk) {
          if (!chunk.baked) {
            this._bakeChunk(chunk)
          }

          chunks.push({
            chunk: chunk,
            position: screenPos,
          })
        }
      }
    }

    this.lastChunksRenderedSize = chunks.length;
    return chunks;
  }

  _bakeChunk(chunk) {
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

        if (tile && PackAssetsRegistry.getTile(tile.pack, tile.sheetPos))
          ctx.drawImage(PackAssetsRegistry.getTile(tile.pack, tile.sheetPos), x * PackAssetsRegistry.DEFAULT_TILE_SPRITE_SIZE[0], y * PackAssetsRegistry.DEFAULT_TILE_SPRITE_SIZE[1]);
      }
    }

    this._bakeLightChunk(chunk);
  }

  _bakeLightChunk(chunk) {
    if (!this.showedMessage) {
      this.showedMessage = true;
      this.screen.client.addLog(`LightBaking`, `Light system currently disabled (ChunkRenderer:102)`);
    }
  }
}

export default ChunkRenderer;