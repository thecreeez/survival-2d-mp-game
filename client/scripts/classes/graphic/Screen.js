import Client from "../Client.js";
import PackAssetsRegistry from "../registry/PackAssetsRegistry.js";
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

    let startRenderTime = Date.now();

    let amountOfRenderObjects = this.renderWorld(client, deltaTime);

    if (client.getMapBuilder().bEnabled) {
      client.getMapBuilder().render(ctx, deltaTime);
    }

    this.renderLogs(client, deltaTime);
    SubtitleHandler.render(canvas, ctx);

    // Rendered objects
    this.renderNumber([10, canvas.height - 10], amountOfRenderObjects, 4);

    // FPS
    this.renderNumber([10, canvas.height - 40], Math.floor(1000 / (Date.now() - startRenderTime)), 2);

    // Rotation
    this.renderNumber([10, canvas.height - 70], client.getPlayer().getAimRotation(), 3);

    this.renderText([10, canvas.height - 100], `DeltaTime: ${Date.now() - startRenderTime}`);
  }

  static renderWorld(client, deltaTime) {
    ctx.save();
    ctx.translate(canvas.width / 2 - client.getPlayer().getPosition()[0], canvas.height / 2 - client.getPlayer().getPosition()[1]);

    let lightMap = false;
    if (client.lightSystemOn) {
      lightMap = MapRenderer.getLightMap(canvas, ctx, client);
    }

    let tilesQueue = MapRenderer.getTilesToRender(canvas, ctx, client);

    // Tiles
    tilesQueue.forEach((gameObject) => {
      MapRenderer.renderGameObject(ctx, gameObject, deltaTime);
    })

    if (client.lightSystemOn) {
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

    if (client.lightSystemOn) {
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

      ctx.drawImage(uiNumberSheet.get(fixedNumber, colorId), position[0] + i * symbolSize + symbolSize, position[1] - symbolSize, symbolSize, symbolSize)
    })
  }

  static renderText(position = [0,0], text) {
    let symbolSize = 20;
    let uiFontSheet = PackAssetsRegistry.getUISheet("core", "font");
    text.split("").forEach((symbol, i) => {
      let pos = getPosition(symbol);

      ctx.drawImage(uiFontSheet.get(pos[0], pos[1]), position[0] + i * symbolSize * 0.9 + symbolSize, position[1] - symbolSize, symbolSize, symbolSize)
    })
  }
}

function getPosition(symbol) {
  symbol = symbol.toUpperCase();
  const POSITIONS = {
    A: [0, 0],
    B: [1, 0],
    C: [2, 0],
    D: [3, 0],
    E: [4, 0],
    F: [5, 0],
    G: [6, 0],
    H: [7, 0],

    I: [0, 1],
    J: [1, 1],
    K: [2, 1],
    L: [3, 1],
    M: [4, 1],
    N: [5, 1],
    O: [6, 1],
    P: [7, 1],

    Q: [0, 2],
    R: [1, 2],
    S: [2, 2],
    T: [3, 2],
    U: [4, 2],
    V: [5, 2],
    W: [6, 2],
    X: [7, 2],

    Y: [0, 3],
    Z: [1, 3],

    "?": [7,7]
  }

  return POSITIONS[symbol] ? POSITIONS[symbol] : [7, 7];
}

export default Screen;