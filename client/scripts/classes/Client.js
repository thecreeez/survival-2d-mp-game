import Application from "/core/Application.js";
import ConnectionHandler from "./ConnectionHandler.js";
import ControlsHandler from "./ControlsHandler.js";
import Screen from "./Screen.js";

import EntityRendererRegistry from "./graphic/EntityRendererRegistry.js";
import PlayerEntityRenderer from "./graphic/entity/PlayerEntityRenderer.js";
import ItemEntityRenderer from "./graphic/entity/ItemEntityRenderer.js";
import OrcEntityRenderer from "./graphic/entity/OrcEntityRenderer.js";

class Client {
  constructor(username, ip) {
    this.registerEntitiesRenderers();
    this.username = username;
    this.lastTimeUpdate = Date.now();

    this.type = "client";
    this.application = new Application(this);
    this.logs = [];
    this.connectionHandler = new ConnectionHandler(this, ip);
    this.controlsHandler = new ControlsHandler(this);

    this.isServerMouseDown = false;

    setInterval(() => {
      let deltaTime = Date.now() - this.lastTimeUpdate
      Application.instance.updateTick();
      this.controlsHandler.update(deltaTime);
      Screen.renderFrame(this, deltaTime);

      this.lastTimeUpdate = Date.now();
    }, 1000 / 60);
  }

  addLog(type, message) {
    this.logs.push({type, message, transition: 1000, lifeTime: 10000})
  }

  setUsername(username) {
    this.username = username;
  }

  getPlayer() {
    let player = null;

    this.application.getEntities().forEach((entity) => {
      if (entity.getType() == "player_entity" && entity.getName() == this.username) {
        player = entity;
      }
    })

    return player;
  }

  registerEntitiesRenderers() {
    EntityRendererRegistry.register(PlayerEntityRenderer);
    EntityRendererRegistry.register(ItemEntityRenderer);
    EntityRendererRegistry.register(OrcEntityRenderer);
  }

  getControlsHandler() {
    return this.controlsHandler;
  }

  getTile(pos) {
    if (pos[0] == 5 && pos[1] == 5) {
      return "red";
    }

    return "black";
  }
}

export default Client;