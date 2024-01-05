import SharedData from "../SharedData.js";

class Tile {
  pack = new SharedData("pack", SharedData.STR_T, "default");
  sheetPos = new SharedData("sheetPos", SharedData.POS_T, [0,0]);
  position = new SharedData("position", SharedData.POS_T, [0,0]);

  constructor({ pack = "default", sheetPos = [0,0], pos = [0,0] } = {}) {
    this.pack.setValue(pack);
    this.sheetPos.setValue(sheetPos);
    this.position.setValue(pos);
  }

  getSpriteData() {
    return {
      pack: this.pack.getValue(),
      0: this.sheetPos.getValue()[0],
      1: this.sheetPos.getValue()[1]
    }

    /**
    {
      pack: "default",
      0: 13,
      1: 2
    }*/
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
    let tileData = [];

    for (let property in this) {
      if (this[property].needToSerialize) {
        tileData.push(this[property].serialize());
      }
    }

    return tileData.join(";");
  }

  serializeLazy() {
    let tileData = [];

    for (let property in this) {
      if (this[property].needToSerialize && (this[property].bUpdated || this[property].bForcedSend)) {
        tileData.push(this[property].serialize());
      }
    }

    return tileData.join(";");
  }

  getPosition() {
    return this.position.getValue();
  }
}

export default Tile;