import ConnectionHandler from "./ConnectionHandler.js";
import Screen from "./Screen.js";
import EntityModel from "./EntityModel.js";

import Application from "/core/Application.js";

class Client {
  constructor(username, ip) {
    this.username = username;

    this.type = "client";
    this.application = new Application(this);
    this.logs = [];
    this.connectionHandler = new ConnectionHandler(this, ip);

    this.keys = {};

    Screen.createScene();

    setInterval(() => {
      Application.instance.updateTick();
      Screen.renderFrame(this);
    }, 1000 / 60);

    window.onmouseup = (ev) => {
      this.isMouseDown = false;
      //CommandInputPacket.clientSend(this.connectionHandler.getSocket(), ..."summon item_entity".split(" "));
    }
    window.onmousedown = (ev) => {
      this.isMouseDown = true;
    }

    window.onkeydown = (ev) => {
      this.keys[ev.code] = true;
    }

    window.onkeyup = (ev) => {
      this.keys[ev.code] = false;
    }
  }

  addVisualization(entity) {
    if (entity == this.playerEntity)
      return;

    Screen.addModelOnScene(entity.getUuid(), new EntityModel(entity))
    Screen.getModelByUuid(entity.getUuid()).getMesh().position.x = entity.getPosition()[0];
    Screen.getModelByUuid(entity.getUuid()).getMesh().position.x = entity.getPosition()[1];
    Screen.getModelByUuid(entity.getUuid()).getMesh().position.x = entity.getPosition()[2];
  }

  updateVisualization(entity) {
    if (entity == this.playerEntity) {
      Screen.camera.position.x = entity.getPosition()[0];
      Screen.camera.position.y = entity.getPosition()[1];
      Screen.camera.position.z = entity.getPosition()[2];
      return;
    }

    Screen.getModelByUuid(entity.getUuid()).getMesh().position.x = entity.getPosition()[0];
    Screen.getModelByUuid(entity.getUuid()).getMesh().position.x = entity.getPosition()[1];
    Screen.getModelByUuid(entity.getUuid()).getMesh().position.x = entity.getPosition()[2];
  }

  removeVisualization(entity) {
    Screen.removeModelFromScene(entity.getUuid());
  }

  addLog(type, message) {
    this.logs.push({type, message, transition: 1000, lifeTime: 10000})
  }

  setUsername(username) {
    this.username = username;
  }

  updatePlayerPosition(direction) {
    Screen.camera.translateZ(-direction[0]);
    Screen.camera.translateX(direction[1]);
    Screen.camera.translateZ(direction[2]);

    return [Screen.camera.position.x, Screen.camera.position.z, Screen.camera.position.z]
  }
}

export default Client;