import Chunk from "../Chunk.js";
import Tile from "../Tile.js";

import core_world from "../../../packs/core/scripts/world.js";
import EntityRegistry from "../../registry/EntityRegistry.js";

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
      let variant = this.getRandomTileVariant(tileVariants);

      let tilePosition = tilesToGenerate[0];
      for (let y = 0; y < ChunkTileGenerator.amountOfTilesPerGenerate; y++) {
        for (let x = 0; x < ChunkTileGenerator.amountOfTilesPerGenerate; x++) {
          let tile = new Tile({ pack: "core", sheetPos: [14 + x, 9 + y] });
          tile.generateData = {
            left: "common",
            right: "common",
            top: "common",
            bottom: "common"
          };

          if (variant) {
            let tileVariants = this.getTileVariantsByGeneratingPosition(variant, x, y);
            let randomTile = tileVariants[Math.floor(tileVariants.length * Math.random())];
            
            tile = Tile.parseFromArray(randomTile);
            tile.generateData = core_world[variant].tags;
          }

          tile.generatingQueue = ++ChunkTileGenerator.generatingQueue;
          chunk.setTile([tilePosition[0] + x, tilePosition[1] + y], tile);
        }
      }

      if (variant && core_world[variant].spawnOnceRules && core_world[variant].spawnOnceRules.length > 0) {
        let x = chunk.getPosition()[0] * Chunk.Size[0] * 40 + (tilePosition[0] + Math.floor(Math.random() * ChunkTileGenerator.amountOfTilesPerGenerate)) * 40 + 20;
        let y = chunk.getPosition()[1] * Chunk.Size[1] * 40 + (tilePosition[1] + Math.floor(Math.random() * ChunkTileGenerator.amountOfTilesPerGenerate)) * 40 + 40;

        let needToSpawn = Math.random() > 0.8;

        if (needToSpawn) {
          let spawnEntityIndex = Math.floor(Math.random() * core_world[variant].spawnOnceRules.length);
          let spawnEntityRule = core_world[variant].spawnOnceRules[spawnEntityIndex];

          const ruleArgs = spawnEntityRule.split("/");
          let id = ruleArgs[0];
          
          let data = {
            worldId: chunk.world.getId(),
            position: [x,y]
          };
          if (id === "core:prop_entity" && ruleArgs.length > 1) {
            data["propId"] = ruleArgs[1];
          }

          chunk.world.application.spawnEntity(new EntityRegistry[id](data));
        }
      }

      tilesToGenerate.splice(0, 1);
    }
  }

  static getTileVariants(adjacentChunks, chunk, tilePos) {
    let adjacentTiles = this.getAdjacentGeneratingParts(adjacentChunks, chunk, tilePos);

    let variants = [];

    let oppositeSides = {
      left: "right",
      top: "bottom",
      bottom: "top",
      right: "left"
    };

    for (let variant in core_world) {
      let checks = [];

      for (let side in adjacentTiles) {
        if (adjacentTiles[side]) {
          let variantTags = core_world[variant].tags[side];
          let adjacentTags = adjacentTiles[side].generateData[oppositeSides[side]];

          variantTags.forEach((variantTag) => {
            if (adjacentTags.indexOf(variantTag) !== -1) {
              checks.push(true);
            }
          })
        } else {
          checks.push(true);
        }
      }

      if (checks.length === 4) {
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

  static getRandomTileVariant(variantsNames) {
    let allWeights = 0;

    variantsNames.forEach((name) => {
      allWeights += core_world[name].weight;
    })

    let pickedWeight = Math.floor(Math.random() * allWeights);

    let currentWeight = 0;
    let pickedVariant = null;
    variantsNames.forEach((variant) => {
      currentWeight += core_world[variant].weight;

      if (!pickedVariant && currentWeight > pickedWeight) {
        pickedVariant = variant;
      }
    })
    return pickedVariant;
  }
}

export default ChunkTileGenerator;