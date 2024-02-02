import SharedData from "../SharedData.js";

class Tile {
  constructor({ pack = "core", sheetPos = [0,0], generatingQueue = 0 } = {}) {
    this.pack = pack;
    this.sheetPos = sheetPos;
    this.generatingQueue = generatingQueue;

    // Автоматически устанавливается при установке в мир
    this.chunk = false;
  }

  static parse(data) {
    let args = data.split(";");

    return new Tile({ pack: args[0], sheetPos: [Number(args[1]), Number(args[2])], generatingQueue: Number(args[3]) })
  }

  static parseFromArray(args) {
    return new Tile({ pack: args[0], sheetPos: [Number(args[1]), Number(args[2])], generatingQueue: Number(args[3]) })
  }

  serialize() {
    return [this.pack, ...this.sheetPos, this.generatingQueue].join(";");
  }
}

export default Tile;