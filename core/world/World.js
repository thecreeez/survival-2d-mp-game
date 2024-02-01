import Application from "../Application.js";
import MathUtils from "../utils/MathUtils.js";
import Vector from "../utils/Vector.js";
import Chunk from "./Chunk.js";
import ChunkTileGenerator from "./generator/ChunkTileGenerator.js";

class World {
  static timePerUpdateToGenerateChunks = 20;

  constructor({pack = "core", id} = {}) {
    this.pack = pack;
    this.id = id;

    this.application = false;

    this._spawnChunksGenerated = false;
    this._chunks = {};
    this._generatingChunksPipe = [];

    this._particles = [];
  }

  updateServerTick() {
    this._generateChunks();
  }

  _generateChunks() {
    if (!this._spawnChunksGenerated) {
      this._generateSpawnChunks();
    }

    let players = this.getEntities().filter(entity => entity.getId() === `player_entity`);


    let start = Date.now();
    // Есть че надо загенерить
    if (this._generatingChunksPipe.length > 0) {
      let generatedChunks = 0;
      for (let i = 0; i < this._generatingChunksPipe.length && (Date.now() - start < World.timePerUpdateToGenerateChunks); i++) {
        this._generateChunk(this._generatingChunksPipe[i]);
        generatedChunks++;
      }
      console.log(`Generated ${generatedChunks} chunks`)
      this._generatingChunksPipe = this._generatingChunksPipe.splice(generatedChunks);
    }
  }

  _generateSpawnChunks() {
    let playerViewDistance = this.application.constructor.playerViewDistance;

    let chunksToGenerate = [];

    // Spawn chunks
    for (let x = -playerViewDistance; x < playerViewDistance; x++) {
      for (let y = -playerViewDistance; y < playerViewDistance; y++) {
        chunksToGenerate.push([x,y]);
      }
    }

    chunksToGenerate.sort((a,b) => new Vector(a).getLength() > new Vector(b).getLength() ? 1 : -1);
    this._generatingChunksPipe.push(...chunksToGenerate);

    this._spawnChunksGenerated = true;
  }

  _generateChunk(position) {
    let chunk = new Chunk({
      worldId: this.getId(),
      position
    });
    //chunk.world = this;
    ChunkTileGenerator.generate(chunk);
    
    this._chunks[position.join(":")] = chunk
  }

  update(deltaTime) {
    this._particles.forEach((particle) => {
      particle.update(deltaTime);
    })
  }

  getTileByWorldPos(pos) {
    let tileSize = 40;

    return this.getTile([Math.floor(pos[0] / tileSize),Math.floor(pos[1] / tileSize)]);
  }

  spawnParticle(particle) {
    particle.world = this;
    particle.world_id.setValue(this.getId());

    if (!this.application.isClient()) {
      
    }

    this._particles.push(particle);

    return particle;
  }

  setTile(pos, tile) {
    let chunkPos = [Math.floor(pos[0] / Chunk.Size[0]), Math.floor(pos[1] / Chunk.Size[1])];

    if (this._chunks[chunkPos.join(":")]) {
      this._chunks[chunkPos.join(":")].setTile([pos[0] - chunkPos[0] * Chunk.Size[0], pos[1] - chunkPos[1] * Chunk.Size[1]], tile);
      this._chunks[chunkPos.join(":")].baked = false;
    }
  }

  getTile(pos) {
    let chunkPos = [Math.floor(pos[0] / Chunk.Size[0]), Math.floor(pos[1] / Chunk.Size[1])];

    let chunk = this._chunks[chunkPos.join(":")]

    if (!chunk) {
      return false;
    }

    return chunk.getTile([pos[0] % Chunk.Size[0], pos[1] % Chunk.Size[1]]);
  }

  setChunk(chunk) {
    this._chunks[chunk.position.getValue().join(":")] = chunk;
    chunk.world = this;
  }

  getChunk(pos) {
    return this._chunks[pos.join(":")];
  }

  getChunks() {
    let chunks = [];
    for (let chunkPos in this._chunks) {
      chunks.push(this._chunks[chunkPos]);
    }
    return chunks;
  }

  getId() {
    return `${this.pack}:${this.id}`;
  }

  getEntities() {
    return Application.instance.getEntities().filter(entity => entity.getWorld() == this);
  }

  getParticles() {
    return this._particles;
  }
}

export default World;