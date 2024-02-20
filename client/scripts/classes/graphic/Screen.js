import Client from "../Client.js";
import PackAssetsRegistry from "../registry/PackAssetsRegistry.js";
import MapRenderer from "./MapRenderer.js";
import SubtitleRenderer from "./SubtitleRenderer.js";
import Hotbar from "./Hotbar.js";
import EntityRenderer from "./entity/EntityRenderer.js";
import LogsRenderer from "./LogsRenderer.js";
import Profiler from "./Profiler.js";


const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
ctx['imageSmoothingEnabled'] = false;       /* standard */
ctx['mozImageSmoothingEnabled'] = false;    /* Firefox */
ctx['oImageSmoothingEnabled'] = false;      /* Opera */
ctx['webkitImageSmoothingEnabled'] = false; /* Safari */
ctx['msImageSmoothingEnabled'] = false;     /* IE */

window.onresize = (ev) => {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  ctx['imageSmoothingEnabled'] = false;       /* standard */
  ctx['mozImageSmoothingEnabled'] = false;    /* Firefox */
  ctx['oImageSmoothingEnabled'] = false;      /* Opera */
  ctx['webkitImageSmoothingEnabled'] = false; /* Safari */
  ctx['msImageSmoothingEnabled'] = false;     /* IE */
}

class Screen {
  constructor(client) {
    this.client = client;

    this.logsRenderer = new LogsRenderer(this);
    this.subtitleRenderer = new SubtitleRenderer(this);
    this.hotbar = new Hotbar(this);
    this.profiler = new Profiler(this);

    this._entitiesToRender = [];
    this._lastEntitiesToRenderUpdate = Date.now();
  }

  clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  renderFrame(deltaTime) {
    this.profiler.start("frame_render");
    this.clear();

    if (!PackAssetsRegistry.isLoaded()) {
      ctx.font = `40px arial`;
      ctx.fillStyle = `black`;
      ctx.fillText(`[Loading assets]`, canvas.width / 2 - ctx.measureText(`[Loading assets]`).width / 2, canvas.height / 2 - 20);
      return;
    }

    if (!this.client.getPlayer()) {
      ctx.font = `40px arial`;
      ctx.fillStyle = `black`;
      ctx.fillText(`[Waiting player]`, canvas.width / 2 - ctx.measureText(`[Loading assets]`).width / 2, canvas.height / 2 - 20);
      return;
    }

    let amountOfRenderObjects = this.renderWorld(deltaTime);

    this.profiler.start("ui_rendering");
    if (this.client.getMapBuilder().bEnabled) {
      this.client.getMapBuilder().render(ctx, deltaTime);
    }

    this.logsRenderer.render();
    this.logsRenderer.update(deltaTime);
    this.subtitleRenderer.render();
    this.subtitleRenderer.update(deltaTime);

    this.hotbar.render();
    this.hotbar.update(deltaTime);
    this.profiler.stop("ui_rendering");

    this.profiler.stop("frame_render");
    this.profiler.render();
  }

  renderWorld(deltaTime) {
    let client = this.client;

    ctx.save();
    ctx.translate(canvas.width / 2 - client.getPlayer().getPosition()[0], canvas.height / 2 - client.getPlayer().getPosition()[1]);
    this.profiler.start("chunks_preparing");
    let chunksQueue = MapRenderer.getChunksToRender(canvas, ctx, client);
    this.profiler.stop("chunks_preparing");

    if (Date.now() - this._lastEntitiesToRenderUpdate > 200) {
      this.updateEntitiesPool();
    }

    // Chunks
    this.profiler.start("chunks_render");
    chunksQueue.forEach((gameObject) => {
      MapRenderer.renderGameObject(ctx, gameObject, deltaTime);
    })
    this.profiler.stop("chunks_render");

    // Entities & Particles
    this.profiler.start("entities_render");
    this._entitiesToRender.forEach((gameObject, i) => {
      MapRenderer.renderGameObject(ctx, gameObject, deltaTime);
    })

    if (client.controlsHandler.hoverEntity !== null) {
      EntityRenderer.renderSelection({
        entity: client.controlsHandler.hoverEntity,
        ctx
      });
    }
    this.profiler.stop("entities_render");

    ctx.restore();

    return this._entitiesToRender.length + chunksQueue.length;
  }

  updateEntitiesPool() {
    let client = this.client;
    this._entitiesToRender = []
    this._entitiesToRender.push(...MapRenderer.getEntitiesToRender(canvas, ctx, client));
    this._entitiesToRender.push(...MapRenderer.getParticlesToRender(client.getPlayer().getWorld()));
    this._entitiesToRender = this._entitiesToRender.sort((a, b) => (a.getPosition()[1] - b.getPosition()[1]));

    console.log(`entities to render updated... `, this._entitiesToRender.length)
    this._lastEntitiesToRenderUpdate = Date.now();
  }

  getMousePosOnWorld() {
    let mousePosOnScreen = this.client.controlsHandler.mousePos;
    return this.toWorldPos(mousePosOnScreen)
  }

  getLocalTilePos(pos) {
    return [Math.floor(pos[0] / MapRenderer.tileSize), Math.floor(pos[1] / MapRenderer.tileSize)];
  }

  getGlobalTilePos(pos) {
    let playerPos = this.client.getPlayer().getPosition();
    return [Math.floor((pos[0] + playerPos[0] - canvas.width / 2) / MapRenderer.tileSize), Math.floor((pos[1] + playerPos[1] - canvas.height / 2) / MapRenderer.tileSize)];
  }

  toLocalPos(pos) {
    let playerPos = this.client.getPlayer().getPosition();
    return [pos[0] - playerPos[0] + canvas.width / 2, pos[1] - playerPos[1] + canvas.height / 2]
  }

  toWorldPos(pos) {
    let playerPos = this.client.getPlayer().getPosition();
    return [pos[0] + playerPos[0] - canvas.width / 2, pos[1] + playerPos[1] - canvas.height / 2]
  }

  renderNumber(position = [0, 0], number, colorId = 0) {
    let symbolSize = 20;
    let uiNumberSheet = PackAssetsRegistry.getUISheet("core", "numbers");
    ("" + number).split("").forEach((numberSymbol, i) => {
      let fixedNumber = numberSymbol - 1 == -1 ? 9 : numberSymbol - 1;

      if (numberSymbol == ".") {
        fixedNumber = 11;
      }

      if (!uiNumberSheet.get(fixedNumber, colorId)) {

      }

      ctx.drawImage(uiNumberSheet.get(fixedNumber, colorId), position[0] + (i - 1.5) * symbolSize + symbolSize, position[1] - symbolSize, symbolSize, symbolSize)
    })
  }
}
export default Screen;