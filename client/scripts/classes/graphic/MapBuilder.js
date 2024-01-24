import TilePlacePacket from "../../../../core/packets/TilePlacePacket.js";
import PackAssetsRegistry from "../registry/PackAssetsRegistry.js";
import MapRenderer from "./MapRenderer.js";
import Screen from "./Screen.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

class MapBuilder {
  constructor(client) {
    this.client = client;

    this.selectedTilesetIndex = 0;
    this.selectedPos = [0,0];
    this.tilesets = PackAssetsRegistry.getPacksId();

    this.mouseDownSelectedPos = [0,0]
    this.mouseUpSelectedPos = [0,0];

    this.bEnabled = false;

    this.bPackSelectorOpened = true;
    this.bTileSelectorOpened = true;

    this.fontSize = 15;
    this.paddingButton = 10;
    this.marginButton = 10;
    this.cellSize = 20;

    this.pos = [10, 10];

    this.packSelectorItems = this.generatePackSelectorItems();
  }

  getCurrentTileset() {
    return PackAssetsRegistry.packs[this.tilesets[this.selectedTilesetIndex]].textures.tileset;
  }

  render(ctx, deltaTime) {
    if (!this.bEnabled) {
      return;
    }

    this.renderPackSelector(ctx);
    this.renderTileSelector(ctx);
    
    if (!this.isMouseOnMenu())
      this.renderTileOnMouse(ctx);
  }

  renderPackSelector(ctx) {
    ctx.textAlign = "left";
    ctx.font = `${this.fontSize}px arial`;
    let currentWidth = this.pos[0];

    this.tilesets.forEach((tileset, i) => {
      ctx.fillStyle = `black`;
      if (i == this.selectedTilesetIndex) {
        ctx.fillStyle = `gray`;
      }
      ctx.fillRect(currentWidth, this.pos[1], this.pos[0] * 2 + ctx.measureText(tileset).width, this.fontSize + 3)

      ctx.fillStyle = `gray`

      if (i == this.selectedTilesetIndex) {
        ctx.fillStyle = `white`;
      }
      ctx.fillText(tileset, this.paddingButton + currentWidth, this.pos[1] + this.fontSize);

      currentWidth += this.paddingButton + ctx.measureText(tileset).width + this.paddingButton + this.marginButton;
    })
  }

  generatePackSelectorItems() {
    ctx.textAlign = "left";
    ctx.font = `${this.fontSize}px arial`;
    let currentWidth = this.pos[0];

    let items = [];

    this.tilesets.forEach((tileset, i) => {
      items.push([currentWidth, this.pos[1], this.pos[0] * 2 + ctx.measureText(tileset).width, this.fontSize + 3]);
      currentWidth += this.paddingButton + ctx.measureText(tileset).width + this.paddingButton + this.marginButton;
    })

    this.packSelectorItems = items;
  }

  renderTileSelector(ctx) {
    let offsetHeight = this.pos[1] + this.fontSize + this.marginButton;

    if (!this.getCurrentTileset()) {
      //console.error(`current tileset isnt exist.`)
      return;
    }

    let tileset = this.getCurrentTileset();
    let tilesetBackground = [this.pos[0], offsetHeight, this.cellSize * tileset.sheetSize[0], this.cellSize * tileset.sheetSize[1]]

    ctx.fillStyle = `black`;
    ctx.fillRect(tilesetBackground[0], tilesetBackground[1], tilesetBackground[2], tilesetBackground[3])
    ctx.drawImage(tileset.img, tilesetBackground[0], tilesetBackground[1], tilesetBackground[2], tilesetBackground[3])

    this._renderSelection(ctx, tilesetBackground, offsetHeight);

    if (this._isItemInPos(tilesetBackground, this.client.controlsHandler.mousePos)) {
      let mousePos = this.client.controlsHandler.mousePos;
      let localMousePos = [mousePos[0] - this.pos[0], mousePos[1] - offsetHeight];
      let mouseTilePos = [Math.floor(localMousePos[0] / this.cellSize), Math.floor(localMousePos[1] / this.cellSize)]

      ctx.strokeStyle = `green`;
      ctx.strokeRect(this.pos[0] + mouseTilePos[0] * this.cellSize, offsetHeight + mouseTilePos[1] * this.cellSize, this.cellSize, this.cellSize);

      ctx.fillStyle = `white`;
      ctx.fillText(`Hover: [${mouseTilePos[0]},${mouseTilePos[1]}]`, this.pos[0], tilesetBackground[1] + tilesetBackground[3] - this.fontSize - 6);
    }
    ctx.fillStyle = `white`;
    ctx.fillText(`Selected: [${this.mouseDownSelectedPos[0]},${this.mouseDownSelectedPos[1]}]`, this.pos[0], tilesetBackground[1] + tilesetBackground[3] - 3);
  }

  _renderSelection(ctx, tilesetBackground, offsetHeight) {
    let mousePos = this.client.controlsHandler.mousePos;

    let localMousePos = [mousePos[0] - this.pos[0], mousePos[1] - offsetHeight];
    let mouseTilePos = [Math.floor(localMousePos[0] / this.cellSize), Math.floor(localMousePos[1] / this.cellSize)]
    let mouseUpPos = this.client.controlsHandler.isMouseDown && this._isItemInPos(tilesetBackground, mousePos) ? mouseTilePos : this.mouseUpSelectedPos;

    let xBounds = [Math.min(this.mouseDownSelectedPos[0], mouseUpPos[0]), Math.max(this.mouseDownSelectedPos[0], mouseUpPos[0])];
    let yBounds = [Math.min(this.mouseDownSelectedPos[1], mouseUpPos[1]), Math.max(this.mouseDownSelectedPos[1], mouseUpPos[1])];

    let sizeSelected = [xBounds[1] - xBounds[0] + 1, yBounds[1] - yBounds[0] + 1];

    ctx.strokeStyle = `yellow`;
    ctx.strokeRect(this.pos[0] + xBounds[0] * this.cellSize, offsetHeight + yBounds[0] * this.cellSize, this.cellSize * sizeSelected[0], this.cellSize * sizeSelected[1]);
  }

  renderTileOnMouse(ctx) {
    if (this.getCurrentTileset()) {
      let playerPos = this.client.getPlayer().getPosition();
      let mousePos = this.client.controlsHandler.mousePos;

      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.translate(canvas.width / 2 - playerPos[0], canvas.height / 2 - playerPos[1]);

      let xBounds = [Math.min(this.mouseDownSelectedPos[0], this.mouseUpSelectedPos[0]), Math.max(this.mouseDownSelectedPos[0], this.mouseUpSelectedPos[0])];
      let yBounds = [Math.min(this.mouseDownSelectedPos[1], this.mouseUpSelectedPos[1]), Math.max(this.mouseDownSelectedPos[1], this.mouseUpSelectedPos[1])];

      let tileTexture;
      let tilePos;
      let tileOnScreenPos;
      for (let x = xBounds[0]; x <= xBounds[1]; x++) {
        for (let y = yBounds[0]; y <= yBounds[1]; y++) {
          tileTexture = this.getCurrentTileset().get(x, y);
          tilePos = Screen.getGlobalTilePos(this.client, [mousePos[0] + (x - xBounds[0]) * MapRenderer.tileSize, mousePos[1] + (y - yBounds[0]) * MapRenderer.tileSize]);
          tileOnScreenPos = [tilePos[0] * MapRenderer.tileSize, tilePos[1] * MapRenderer.tileSize];

          if (!tileTexture)
            return console.error(this.selectedPos);

          ctx.drawImage(tileTexture, tileOnScreenPos[0], tileOnScreenPos[1], MapRenderer.tileSize, MapRenderer.tileSize);
        }
      }
      ctx.restore();
    }
  }

  isMouseOnMenu() {
    if (this.isMouseOnTileSelector()) {
      return true;
    }

    let bOnButton = false;

    if (!this.packSelectorItems) {
      this.generatePackSelectorItems()
    }

    this.packSelectorItems.forEach((itemCandidate, i) => {
      if (bOnButton)
        return;

      if (this._isItemInPos(itemCandidate, this.client.controlsHandler.mousePos)) {
        bOnButton = true;
      }
    })

    return bOnButton;
  }

  isMouseOnTileSelector() {
    let offsetHeight = this.pos[1] + this.fontSize + this.marginButton;
    let tileset = this.getCurrentTileset();

    if (!tileset)
      return false;

    let tilesetBackground = [this.pos[0], offsetHeight, this.cellSize * tileset.sheetSize[0], this.cellSize * tileset.sheetSize[1]];

    return this._isItemInPos(tilesetBackground, this.client.controlsHandler.mousePos);
  }

  handleMouseUp(pos) {
    if (!this.bEnabled)
      return;

    if (this.isMouseOnTileSelector()) {
      let offsetHeight = this.pos[1] + this.fontSize + this.marginButton;

      let localMousePos = [pos[0] - this.pos[0], pos[1] - offsetHeight];
      let tilePos = [Math.floor(localMousePos[0] / this.cellSize), Math.floor(localMousePos[1] / this.cellSize)];
      this.mouseUpSelectedPos = tilePos;
      return;
    }
  }

  handleMouseDown(pos) {
    if (!this.bEnabled)
      return;

    if (this.bPackSelectorOpened) {
      let item = null;

      this.packSelectorItems.forEach((itemCandidate, i) => {
        if (item != null)
          return;

        if (this._isItemInPos(itemCandidate, pos)) {
          item = i;
        }
      })

      if (item != null) {
        this.selectedTilesetIndex = item;
        return;
      }
    }

    if (this.isMouseOnTileSelector()) {
      let offsetHeight = this.pos[1] + this.fontSize + this.marginButton;

      let localMousePos = [pos[0] - this.pos[0], pos[1] - offsetHeight];
      let tilePos = [Math.floor(localMousePos[0] / this.cellSize), Math.floor(localMousePos[1] / this.cellSize)];
      this.mouseDownSelectedPos = tilePos;
      return;
    }

    if (!this.getCurrentTileset())
      return;

    let xBounds = [Math.min(this.mouseDownSelectedPos[0], this.mouseUpSelectedPos[0]), Math.max(this.mouseDownSelectedPos[0], this.mouseUpSelectedPos[0])];
    let yBounds = [Math.min(this.mouseDownSelectedPos[1], this.mouseUpSelectedPos[1]), Math.max(this.mouseDownSelectedPos[1], this.mouseUpSelectedPos[1])];

    let tilePos;
    for (let x = xBounds[0]; x <= xBounds[1]; x++) {
      for (let y = yBounds[0]; y <= yBounds[1]; y++) {
        tilePos = Screen.getGlobalTilePos(this.client, [pos[0] + (x - xBounds[0]) * MapRenderer.tileSize, pos[1] + (y - yBounds[0]) * MapRenderer.tileSize]);
        TilePlacePacket.clientSend(this.client.connectionHandler.getSocket(), { pos: tilePos, pack: this.tilesets[this.selectedTilesetIndex], sheetPos: [x,y] });
      }
    }
  }

  // item [x, y, width, height] pos [x,y]
  _isItemInPos(item,pos) {
    if (item[0] > pos[0])
      return false;

    if (item[1] > pos[1])
      return false;

    if (item[0] + item[2] < pos[0])
      return false;

    if (item[1] + item[3] < pos[1])
      return false;

    return true;
  }
}

export default MapBuilder;