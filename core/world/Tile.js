import SharedData from "../SharedData.js";

class Tile {
  constructor({ pack = "core", sheetPos = [0,0] } = {}) {
    this.pack = pack;
    this.sheetPos = sheetPos;

    // Автоматически устанавливается при установке в мир
    this.chunk = false;
  }

  static parse(data) {
    let args = data.split(";");

    return new Tile({ pack: args[0], sheetPos: [Number(args[1]), Number(args[2])] })
  }

  serialize() {
    return [this.pack, ...this.sheetPos].join(";");
  }
}

export default Tile;