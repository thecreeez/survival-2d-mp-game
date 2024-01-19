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

    this.bEnabled = true;

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

    ctx.strokeStyle = `yellow`;
    ctx.strokeRect(this.pos[0] + this.selectedPos[0] * this.cellSize, offsetHeight + this.selectedPos[1] * this.cellSize, this.cellSize, this.cellSize)

    let mousePos = this.client.controlsHandler.mousePos;

    if (this._isItemInPos(tilesetBackground, this.client.controlsHandler.mousePos)) {
      let localMousePos = [mousePos[0] - this.pos[0], mousePos[1] - offsetHeight];
      let tilePos = [Math.floor(localMousePos[0] / this.cellSize), Math.floor(localMousePos[1] / this.cellSize)]

      ctx.strokeStyle = `green`;
      ctx.strokeRect(this.pos[0] + tilePos[0] * this.cellSize, offsetHeight + tilePos[1] * this.cellSize, this.cellSize, this.cellSize);

      ctx.fillStyle = `white`;
      ctx.fillText(`Hover: [${tilePos[0]},${tilePos[1]}]`, this.pos[0], tilesetBackground[1] + tilesetBackground[3] - this.fontSize - 6);
    }
    ctx.fillStyle = `white`;
    ctx.fillText(`Selected: [${this.selectedPos[0]},${this.selectedPos[1]}]`, this.pos[0], tilesetBackground[1] + tilesetBackground[3] - 3);
  }

  renderTileOnMouse(ctx) {
    if (this.getCurrentTileset()) {
      let tileTexture = this.getCurrentTileset().get(this.selectedPos[0], this.selectedPos[1]);

      if (!tileTexture)
        return console.error(this.selectedPos);

      let playerPos = this.client.getPlayer().getPosition();
      let mousePos = this.client.controlsHandler.mousePos;
      let tilePos = Screen.getGlobalTilePos(this.client, mousePos);

      ctx.save();
      ctx.translate(canvas.width / 2 - playerPos[0], canvas.height / 2 - playerPos[1]);

      let cellPos = [tilePos[0] * MapRenderer.tileSize, tilePos[1] * MapRenderer.tileSize]

      ctx.drawImage(tileTexture, cellPos[0], cellPos[1], MapRenderer.tileSize, MapRenderer.tileSize);
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

  handleClick(pos) {
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
      this.selectedPos = tilePos;
      return;
    }

    if (!this.getCurrentTileset())
      return;

    let tilePos = Screen.getGlobalTilePos(this.client, pos);
    TilePlacePacket.clientSend(this.client.connectionHandler.getSocket(), { pos: tilePos, pack: this.tilesets[this.selectedTilesetIndex], sheetPos: this.selectedPos });
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