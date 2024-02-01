import Chunk from "../Chunk.js";
import Tile from "../Tile.js";

import core_world from "../../../packs/core_world.js";

class ChunkTileGenerator {
  static generate(chunk) {
    /**
     * Preparing - Creating queue
     */
    let tilesToGenerate = [];

    for (let y = 0; y < Chunk.Size[1]; y++) {
      for (let x = 0; x < Chunk.Size[0]; x++) {
        tilesToGenerate.push([x,y]);
      }
    }

    /**
     * Preparing - Finding adjacent chunks to edges
     */
    let adjacentChunks = chunk.getAdjacentChunks();

    /**
     * Generating
     */
    while (tilesToGenerate.length > 0) {
      tilesToGenerate = tilesToGenerate.sort((a, b) => this.getTileVariants(adjacentChunks, chunk, a).length > this.getTileVariants(adjacentChunks, chunk, b).length ? 1 : -1);

      let tileVariants = this.getTileVariants(adjacentChunks, chunk, tilesToGenerate[0]);
      let variant = tileVariants[Math.floor(Math.random() * tileVariants.length)];

      if (variant) {
        let randomTile = core_world[variant].tiles[Math.floor(Math.random() * core_world[variant].tiles.length)];

        let tile = Tile.parseFromArray(randomTile);
        tile.generatedTag = variant;

        chunk.setTile(tilesToGenerate[0], tile);
      } else {
        let tile = new Tile({ pack: "core", sheetPos: [14, 9] });
        tile.generatedTag = "common"
        chunk.setTile(tilesToGenerate[0], tile);
      }

      tilesToGenerate.splice(0, 1);
    }
  }

  static getTileVariants(adjacentChunks, chunk, tilePos) {
    let [x, y] = tilePos;

    let adjacentTiles =  {
      left: chunk.getTile([x - 1, y]),
      right: chunk.getTile([x + 1, y]),
      top: chunk.getTile([x, y - 1]),
      bottom: chunk.getTile([x, y + 1]),
    };

    if (x - 1 < 0 && adjacentChunks.left) {
      adjacentTiles.left = adjacentChunks.left.getTile([Chunk.Size[0] - 1, y])
    }

    if (x + 1 >= Chunk.Size[0] && adjacentChunks.right) {
      adjacentTiles.right = adjacentChunks.right.getTile([0, y])
    }

    if (y - 1 < 0 && adjacentChunks.top) {
      adjacentTiles.top = adjacentChunks.top.getTile([x, Chunk.Size[1] - 1])
    }

    if (y + 1 >= Chunk.Size[1] && adjacentChunks.bottom) {
      adjacentTiles.bottom = adjacentChunks.bottom.getTile([x, 0])
    }

    let variants = [];

    for (let variant in core_world) {
      let isVariantCanBeUsed = true;

      for (let side in adjacentTiles) {
        if (adjacentTiles[side]) {
          let tag = adjacentTiles[side].generatedTag;
          let connections = core_world[variant].connections[side];

          if (connections.indexOf(tag) === -1) {
            isVariantCanBeUsed = false;
          }
        }
      }

      if (isVariantCanBeUsed) {
        variants.push(variant);
      }
    }

    return variants;
  }
}

export default ChunkTileGenerator;