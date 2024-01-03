import Client from "./Client.js";
import EntityWithAIRender from "./EntityRender.js";
import ItemRender from "./ItemRender.js";
import PlayerRender from "./PlayerRender.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

window.onresize = (ev) => {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
}

class Screen {
  static lastFrame = Date.now();

  static clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * 
   * @param {Client} client 
   */
  static renderFrame(client) {
    this.clear();
    this.renderLogs(client, Date.now() - this.lastFrame);

    client.application.getEntities().forEach((entity) => {
      if (entity.getType() == "player_entity") {
        PlayerRender.render(ctx, entity);
      } else if (entity.getType() == "entity_with_ai") {
        EntityWithAIRender.render(ctx, entity);
      } else if (entity.getType() == "item_entity") {
        ItemRender.render(ctx, entity);
      }
    })

    this.lastFrame = Date.now();
  }

  /**
   * 
   * @param {Client} client 
   */
  static renderLogs(client, deltaTime) {
    ctx.fillStyle = `green`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let fontSize = 20;
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
}

export default Screen;