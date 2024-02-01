import SharedData from "../SharedData.js";

class Chunk {
  static Size = [16,16];

  world_id = new SharedData("world_id", SharedData.STR_T, "core:spawn");
  position = new SharedData("position", SharedData.POS_T, [0,0]);
  tiles = new SharedData("tiles", SharedData.TILE_ARR_T, []);

  baked = false;
  canvas = false;

  constructor({ worldId, position } = {}) {
    this.world_id.setValue(worldId);
    this.position.setValue(position);
  }

  setTile(position, tile) {
    if (position[0] < 0 || position[0] >= Chunk.Size[0]) {
      throw new Error(`Tile tries to set tile out of bounds: `, position);
    }

    if (position[1] < 0 || position[1] >= Chunk.Size[1]) {
      throw new Error(`Tile tries to set tile out of bounds: `, position);
    }

    this.tiles.getValue()[position[1] * Chunk.Size[0] + position[0]] = tile;
    this.tiles.bUpdated = true;
  }

  getTile(position) {
    return this.tiles.getValue()[position[1] * Chunk.Size[0] + position[0]];
  }

  static parse(data) {
    let dataFragments = data.split("\\ch\\");

    return new this().load(dataFragments);
  }

  load(datas) {
    datas.forEach((serializedData) => {
      let data = SharedData.parse(serializedData);

      if (data)
        this[data.getId()].setValue(data.getValue())
    })

    return this;
  }

  serialize() {
    let particleData = [];

    for (let property in this) {
      if (this[property] && this[property].needToSerialize) {
        particleData.push(this[property].serialize());
      }
    }

    return particleData.join("\\ch\\");
  }

  getWorld() {
    return this.world;
  }

  getCanvas() {
    return this.canvas;
  }
}

export default Chunk;