import Client from "../Client.js";
import PackAssetsRegistry from "../registry/PackAssetsRegistry.js";
import MapRenderer from "./MapRenderer.js";
import SubtitleHandler from "./SubtitleHandler.js";
import HumanGuardEntityRenderer from "./entity/HumanGuardEntityRenderer.js";
import Hotbar from "./Hotbar.js";


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

    let amountOfRenderObjects = this.renderWorld(client, deltaTime);

    if (client.getMapBuilder().bEnabled) {
      client.getMapBuilder().render(ctx, deltaTime);
    }

    this.renderLogs(client, deltaTime);
    SubtitleHandler.render(canvas, ctx);

    Hotbar.render(canvas, ctx, client);
  }

  static renderWorld(client, deltaTime) {
    ctx.save();
    ctx.translate(canvas.width / 2 - client.getPlayer().getPosition()[0], canvas.height / 2 - client.getPlayer().getPosition()[1]);

    let lightMap = false;
    if (client.lightEngineOn) {
      lightMap = MapRenderer.getLightMap(canvas, ctx, client);
    }

    let tilesQueue = MapRenderer.getTilesToRender(canvas, ctx, client);

    // Tiles
    tilesQueue.forEach((gameObject) => {
      MapRenderer.renderGameObject(ctx, gameObject, deltaTime);
    })

    if (client.lightEngineOn) {
      MapRenderer.renderLightSources(ctx, lightMap);
    }

    let queue = []
    queue.push(...MapRenderer.getEntitiesToRender(canvas, ctx, client));
    queue.push(...MapRenderer.getParticlesToRender(client.getPlayer().getWorld()));
    queue = queue.sort((a, b) => a.getPosition()[1] > b.getPosition()[1] ? 1 : -1);

    // Entities & Particles
    queue.forEach((gameObject, i) => {
      MapRenderer.renderGameObject(ctx, gameObject, deltaTime);
    })

    if (client.lightEngineOn) {
      MapRenderer.renderFog(ctx, lightMap);
    }

    ctx.restore();

    return queue.length + tilesQueue.length;
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
    return [Math.floor(pos[0] / MapRenderer.tileSize), Math.floor(pos[1] / MapRenderer.tileSize)];
  }

  static getGlobalTilePos(client, pos) {
    let playerPos = client.getPlayer().getPosition();
    return [Math.floor((pos[0] + playerPos[0] - canvas.width / 2) / MapRenderer.tileSize), Math.floor((pos[1] + playerPos[1] - canvas.height / 2) / MapRenderer.tileSize)];
  }

  static toLocalPos(client, pos) {
    let playerPos = client.getPlayer().getPosition();
    return [pos[0] - playerPos[0] + canvas.width / 2, pos[1] - playerPos[1] + canvas.height / 2]
  }

  static toWorldPos(client, pos) {
    let playerPos = client.getPlayer().getPosition();
    return [pos[0] + playerPos[0] - canvas.width / 2, pos[1] + playerPos[1] - canvas.height / 2]
  }

  static renderNumber(position = [0,0], number, colorId = 0) {
    let symbolSize = 20;
    let uiNumberSheet = PackAssetsRegistry.getUISheet("core", "numbers");
    ("" + number).split("").forEach((numberSymbol, i) => {
      let fixedNumber = numberSymbol - 1 == -1 ? 9 : numberSymbol - 1;

      if (numberSymbol == ".") {
        fixedNumber = 11;
      }

      if (!uiNumberSheet.get(fixedNumber, colorId)) {
        console.log(numberSymbol);
      }

      ctx.drawImage(uiNumberSheet.get(fixedNumber, colorId), position[0] + (i - 1.5) * symbolSize + symbolSize, position[1] - symbolSize, symbolSize, symbolSize)
    })
  }
}

export default Screen;