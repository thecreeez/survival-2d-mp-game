import Chunk from "../Chunk.js";
import Tile from "../Tile.js";

import core_world from "../../../packs/core_world.js";

class ChunkTileGenerator {
  static generatingQueue = 0;
  static amountOfTilesPerGenerate = 2;

  static generate(chunk) {
    /**
     * Preparing - Creating queue
     */
    let tilesToGenerate = [];

    for (let y = 0; y < Chunk.Size[1]; y += ChunkTileGenerator.amountOfTilesPerGenerate) {
      for (let x = 0; x < Chunk.Size[0]; x += ChunkTileGenerator.amountOfTilesPerGenerate) {
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

      let tilePosition = tilesToGenerate[0];
      for (let y = 0; y < ChunkTileGenerator.amountOfTilesPerGenerate; y++) {
        for (let x = 0; x < ChunkTileGenerator.amountOfTilesPerGenerate; x++) {
          let tile = new Tile({ pack: "core", sheetPos: [14 + x, 9 + y] });

          tile.generatedTag = "common";
          if (variant) {
            let tileVariants = this.getTileVariantsByGeneratingPosition(variant, x, y);
            let randomTile = tileVariants[Math.floor(tileVariants.length * Math.random())];
            
            tile = Tile.parseFromArray(randomTile);
            tile.generatedTag = variant;
          }

          tile.generatingQueue = ++ChunkTileGenerator.generatingQueue;
          chunk.setTile([tilePosition[0] + x, tilePosition[1] + y], tile);
        }
      }

      tilesToGenerate.splice(0, 1);
    }
  }

  static getTileVariants(adjacentChunks, chunk, tilePos) {
    let adjacentTiles = this.getAdjacentGeneratingParts(adjacentChunks, chunk, tilePos);

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

  static getAdjacentGeneratingParts(adjacentChunks, chunk, pos) {
    let [x, y] = pos;
    let adjacentTiles = {
      left: chunk.getTile([x - ChunkTileGenerator.amountOfTilesPerGenerate, y]),
      right: chunk.getTile([x + ChunkTileGenerator.amountOfTilesPerGenerate, y]),
      top: chunk.getTile([x, y - ChunkTileGenerator.amountOfTilesPerGenerate]),
      bottom: chunk.getTile([x, y + ChunkTileGenerator.amountOfTilesPerGenerate]),
    };

    if (x - ChunkTileGenerator.amountOfTilesPerGenerate < 0 && adjacentChunks.left) {
      adjacentTiles.left = adjacentChunks.left.getTile([Chunk.Size[0] - ChunkTileGenerator.amountOfTilesPerGenerate, y])
    }

    if (x + ChunkTileGenerator.amountOfTilesPerGenerate >= Chunk.Size[0] && adjacentChunks.right) {
      adjacentTiles.right = adjacentChunks.right.getTile([0, y])
    }

    if (y - ChunkTileGenerator.amountOfTilesPerGenerate < 0 && adjacentChunks.top) {
      adjacentTiles.top = adjacentChunks.top.getTile([x, Chunk.Size[1] - ChunkTileGenerator.amountOfTilesPerGenerate])
    }

    if (y + ChunkTileGenerator.amountOfTilesPerGenerate >= Chunk.Size[1] && adjacentChunks.bottom) {
      adjacentTiles.bottom = adjacentChunks.bottom.getTile([x, 0])
    }

    return adjacentTiles;
  }

  static getAdjacentTiles(adjacentChunks, chunk, pos) {
    let [x,y] = pos;
    let adjacentTiles = {
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

    return adjacentTiles;
  }

  static getAdjacentTilePoses(pos) {
    let [x, y] = pos;
    return [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];
  }

  static getTileVariantsByGeneratingPosition(variant, x, y) {
    let tileVariants = [];
    let haveExactTile = false;

    core_world[variant].tiles.forEach(tile => {
      if (tile.length > 3) {
        let pos = tile[3].split(":");

        if (Number(pos[0]) === x && Number(pos[1]) === y) {
          haveExactTile = true;
        }
      }
    })

    core_world[variant].tiles.forEach(tile => {
      if (haveExactTile) {
        let pos = tile[3].split(":");

        if (Number(pos[0]) !== x || Number(pos[1]) !== y) {
          return;
        }
      }

      tileVariants.push(tile);
    })

    return tileVariants;
  }
}

export default ChunkTileGenerator;