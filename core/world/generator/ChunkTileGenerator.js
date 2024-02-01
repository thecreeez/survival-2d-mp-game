import Chunk from "../Chunk.js";
import Tile from "../Tile.js";

class ChunkTileGenerator {
  static generate(chunk) {
    for (let y = 0; y < Chunk.Size[1]; y++) {
      for (let x = 0; x < Chunk.Size[0]; x++) {
        chunk.setTile([x,y], new Tile({ pack: "core", sheetPos: [1,1], chunk, pos: [x,y] }));
      }
    }

    /**
     * Add rules to generation
     */
  }
}

export default ChunkTileGenerator;