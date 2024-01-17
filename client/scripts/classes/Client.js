import Application from "/core/Application.js";
import ConnectionHandler from "./ConnectionHandler.js";
import ControlsHandler from "./ControlsHandler.js";
import MapBuilder from "./graphic/MapBuilder.js";
import Screen from "./graphic/Screen.js";

import EntityRendererRegistry from "./graphic/EntityRendererRegistry.js";
import PlayerEntityRenderer from "./graphic/entity/PlayerEntityRenderer.js";
import ItemEntityRenderer from "./graphic/entity/ItemEntityRenderer.js";
import OrcEntityRenderer from "./graphic/entity/OrcEntityRenderer.js";
import EffectEntityRenderer from "./graphic/entity/EffectEntityRenderer.js";
import PackAssetsRegistry from "./registry/PackAssetsRegistry.js";

class Client {
  constructor(username, ip) {
    this.username = username;
    this.lastTimeUpdate = Date.now();

    this.type = "client";
    this.application = new Application(this);
    this.logs = [];
    this.connectionHandler = new ConnectionHandler(this, ip);
    this.controlsHandler = new ControlsHandler(this);
    this.mapBuilder = new MapBuilder(this);

    this.mapBuilder.bEnabled = true;

    this.register();

    setInterval(() => {
      let deltaTime = Date.now() - this.lastTimeUpdate
      Application.instance.updateTick();
      this.controlsHandler.update(deltaTime);
      Screen.SubtitleHandler.update(deltaTime);
      
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
      if (entity.getId() == "player_entity" && entity.getName() == this.username) {
        player = entity;
      }
    })

    return player;
  }

  registerAssetPack(packId, packData) {
    PackAssetsRegistry.register(packId, packData);
  }

  register() {
    EntityRendererRegistry.register(PlayerEntityRenderer);
    EntityRendererRegistry.register(ItemEntityRenderer);
    EntityRendererRegistry.register(OrcEntityRenderer);
    EntityRendererRegistry.register(EffectEntityRenderer);
  }

  getControlsHandler() {
    return this.controlsHandler;
  }

  getTileAt(x, y) {
    let tile = this.getPlayer().getWorld().getTile([x, y]);

    if (!tile) {
      return false;
    }

    return tile.getSpriteData();
  }

  getMapBuilder() {
    return this.mapBuilder;
  }

  getScreen() {
    return Screen;
  }
}

export default Client;