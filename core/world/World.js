import Application from "../Application.js";

class World {
  constructor({pack = "core", id} = {}) {
    this.pack = pack;
    this.id = id;

    this.application = false;

    this._tiles = {};
  }

  save(tilePresets) {
    if (this.isClient())
      return false;

    let tileMap = this.generateTileMap(tilePresets)

    return {
      "world": this.getId(),
      "tile-map": tileMap
    }
  }

  generateTileMap(tilePresets) {
    let tileMap = {};

    for (let tilePos in this.getTiles()) {
      let tile = this.getTiles()[tilePos];
      let tilePreset = null;

      tilePresets.forEach((tilePresetCandidate, i) => {
        if (tilePresetCandidate[0] == tile.pack.getValue() && tilePresetCandidate[1] == tile.sheetPos.getValue()[0] && tilePresetCandidate[2] == tile.sheetPos.getValue()[1]) {
          tilePreset = i;
        }
      })

      if (tilePreset != null) {
        tileMap[tilePos] = tilePreset;
      }
    }

    return tileMap;
  }

  static load(json) {
    if (this.isClient())
      return false;

      // TO-DO: LOADING WORLDS
    return;
    console.log(`Loading tiles...`)
    let presets = json["tile-presets"];
    let tileMap = json["tile-map"];

    console.log(`Tile presets... ${presets.length}`);

    let i = 0;
    for (let tilePos in tileMap) {
      let [x, y] = tilePos.split(":");

      let preset = presets[tileMap[tilePos]];

      this.setTile(new Tile({
        pack: preset[0],
        sheetPos: [preset[1], preset[2]],
        pos: [x, y]
      }));

      i++;
    }
    console.log(`Tiles... ${i}`);
  }

  getTile(pos) {
    return this._tiles[`${pos[0]}:${pos[1]}`];
  }

  setTile(tile) {
    this._tiles[`${tile.getPosition()[0]}:${tile.getPosition()[1]}`] = tile;
    tile.world = this;
  }

  getTiles() {
    return this._tiles;
  }

  getId() {
    return `${this.pack}:${this.id}`;
  }

  getEntities() {
    return Application.instance.getEntities().filter(entity => entity.getWorld() == this);
  }
}

export default World;