import Client from "../Client.js";
import EntityRendererRegistry from "./EntityRendererRegistry.js";
import MapRenderer from "./MapRenderer.js";
import SubtitleHandler from "./SubtitleHandler.js";

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
  static SubtitleHandler = SubtitleHandler;

  static clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * 
   * @param {Client} client 
   */
  static renderFrame(client, deltaTime) {
    this.clear();

    if (!client.getPlayer())
      return;

    ctx.save();
    ctx.translate(canvas.width / 2 - client.getPlayer().getPosition()[0], canvas.height / 2 - client.getPlayer().getPosition()[1]);

    this.renderWorld(client, deltaTime, MapRenderer.RenderSteps.floor);

    client.application.getEntities().sort((a,b) => a.getPosition()[1] > b.getPosition()[1] ? 1 : -1).forEach((entity) => {
      if (EntityRendererRegistry[entity.getId()]) {
        EntityRendererRegistry[entity.getId()].render(ctx, entity);
        EntityRendererRegistry[entity.getId()].updateEntity(entity, deltaTime);
        return;
      }

      console.error(`Entity ${entity.getUuid()} ${entity.getId()} can't be rendered. Renderer has not be set.`);
    })

    this.renderWorld(client, deltaTime, MapRenderer.RenderSteps.wall);
    this.renderWorld(client, deltaTime, MapRenderer.RenderSteps.top);

    ctx.restore();

    if (client.getMapBuilder().bEnabled) {
      client.getMapBuilder().render(ctx, deltaTime);
    }

    //this.renderLogs(client, deltaTime);
    SubtitleHandler.render(canvas, ctx);
  }

  static renderWorld(client, deltaTime, type) {
    MapRenderer.render(canvas, ctx, client, type);
  }

  /**
   * 
   * @param {Client} client 
   */
  static renderLogs(client, deltaTime) {
    let fontSize = 20;
    ctx.textAlign = "left";
    ctx.font = `${fontSize}px arial`;

    let logsHeight = client.logs.length * fontSize + fontSize / 2;
    let logsWidth = Math.max(...client.logs.map(value => ctx.measureText(`[${value.type}] ${value.message}`).width));

    if (logsWidth < 0) {
      logsWidth = 0;
    }

    ctx.fillStyle = `black`;
    ctx.fillRect(0,0,logsWidth, logsHeight);

    client.logs.forEach((log, i) => {
      let transition = log.lifeTime / log.transition;

      switch (log.type) {
        case "INFO": ctx.fillStyle = `rgba(255,255,255,${transition})`; break;
        case "ERROR": ctx.fillStyle = `rgba(255,0,0,${transition})`; break;
        case "WARNING": ctx.fillStyle = `rgba(255,223,0,${transition})`; break;
      }

      let height = i * fontSize;

      ctx.fillText(`[${log.type}] ${log.message}`, 0, fontSize + height);
      log.lifeTime -= deltaTime;
    })

    client.logs = client.logs.filter((log) => log.lifeTime > 0)
  }

  static getMousePosOnWorld(client) {
    let mousePosOnScreen = client.controlsHandler.mousePos;
    return this.toWorldPos(client, mousePosOnScreen)
  }

  static getLocalTilePos(pos) {
    return [Math.floor(pos[0] / MapRenderer.cellSize), Math.floor(pos[1] / MapRenderer.cellSize)];
  }

  static getGlobalTilePos(client, pos) {
    let playerPos = client.getPlayer().getPosition();
    return [Math.floor((pos[0] + playerPos[0] - canvas.width / 2) / MapRenderer.cellSize), Math.floor((pos[1] + playerPos[1] - canvas.height / 2) / MapRenderer.cellSize)];
  }

  static toLocalPos(client, pos) {
    let playerPos = client.getPlayer().getPosition();
    return [pos[0] - playerPos[0] + canvas.width / 2, pos[1] - playerPos[1] + canvas.height / 2]
  }

  static toWorldPos(client, pos) {
    let playerPos = client.getPlayer().getPosition();
    return [pos[0] + playerPos[0] - canvas.width / 2, pos[1] + playerPos[1] - canvas.height / 2]
  }
}

export default Screen;