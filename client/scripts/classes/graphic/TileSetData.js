class TileSetData {
  static RenderSteps = {
    floor: "floor",
    wall: "wall",
    top: "top"
  }

  constructor(tileset) {
    this.tileset = tileset;

    this.tilesetStepSettings = [];
  }
  
  setRenderStep(x,y,renderStep) {
    if (x > this.tileset.sheetSize[0]) {
      console.error(`Out of bounds...`)
      return this;
    }

    if (y > this.tileset.sheetSize[1]) {
      console.error(`Out of bounds...`)
      return this;
    }

    if (!this.tilesetStepSettings[y]) {
      this.tilesetStepSettings[y] = [];
    }

    this.tilesetStepSettings[y][x] = renderStep;

    return this;
  }

  getRenderStep(x,y) {
    if (!this.tilesetStepSettings[y]) {
      return TileSetData.RenderSteps.floor;
    }

    if (!this.tilesetStepSettings[y][x]) {
      return TileSetData.RenderSteps.floor;
    }

    return this.tilesetStepSettings[y][x];
  }
}

export default TileSetData;