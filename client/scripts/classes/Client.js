import Application from "/core/Application.js";
import ConnectionHandler from "./ConnectionHandler.js";
import ControlsHandler from "./ControlsHandler.js";
import MapBuilder from "./graphic/MapBuilder.js";
import Screen from "./graphic/Screen.js";
import Hotbar from "./graphic/Hotbar.js";

import PlasmaProjectileEntityRenderer from "./graphic/entity/PlasmaProjectileEntityRenderer.js";
import EntityRendererRegistry from "./graphic/EntityRendererRegistry.js";
import PlayerEntityRenderer from "./graphic/entity/PlayerEntityRenderer.js";
import SpiderEntityRenderer from "./graphic/entity/SpiderEntityRenderer.js";
import ItemEntityRenderer from "./graphic/entity/ItemEntityRenderer.js";
import PropEntityRenderer from "./graphic/entity/PropEntityRenderer.js";
import HumanGuardEntityRenderer from "./graphic/entity/HumanGuardEntityRenderer.js";

import PackAssetsRegistry from "./registry/PackAssetsRegistry.js";

class Client {
  constructor(username, ip) {
    Client.instance = this;

    this.startTime = Date.now();

    this.username = username;
    this.lastTimeUpdate = Date.now();

    this.type = "client";
    this.application = new Application(this);
    this.logs = [];
    this.connectionHandler = new ConnectionHandler(this, ip);
    this.controlsHandler = new ControlsHandler(this);
    this.mapBuilder = new MapBuilder(this);

    this.screen = new Screen(this);

    this.lightEngineOn = true;

    setInterval(() => {
      if (this.application.state === 0) {
        return;
      }

      if (this.connectionHandler.opened && !this.connectionHandler.handshaked) {
        this.connectionHandler.handshake();
      }

      let deltaTime = Date.now() - this.lastTimeUpdate;
      Application.instance.updateTick();
      this.controlsHandler.update(deltaTime);
      this.screen.renderFrame(deltaTime);

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
    EntityRendererRegistry.register(SpiderEntityRenderer);
    EntityRendererRegistry.register(ItemEntityRenderer);
    EntityRendererRegistry.register(PlasmaProjectileEntityRenderer);
    EntityRendererRegistry.register(PropEntityRenderer);
    EntityRendererRegistry.register(HumanGuardEntityRenderer);
  }

  async registerPacks() {
    const packsRequest = await fetch("/getPacks");
    const packsJSON = await packsRequest.json();
    
    for (let packId of packsJSON) {
      let commonInit = await import(`../../../packs/${packId}/scripts/CommonInit.js`);
      this.application.registerPack(commonInit.default);
    }

    this.application.loadPacks();
    this.register();
  }

  getControlsHandler() {
    return this.controlsHandler;
  }

  getMapBuilder() {
    return this.mapBuilder;
  }

  getScreen() {
    return Screen;
  }

  getHotbar() {
    return Hotbar;
  }
}

export default Client;