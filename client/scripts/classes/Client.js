import Application from "/core/Application.js";
import ConnectionHandler from "./ConnectionHandler.js";
import Screen from "./Screen.js";
import CommandInputPacket from "/core/packets/CommandInputPacket.js";

class Client {
  constructor(username, ip) {
    this.username = username;

    this.type = "client";
    this.application = new Application(this);
    this.logs = [];
    this.connectionHandler = new ConnectionHandler(this, ip);

    this.serverMousePos = [0,0]
    this.mousePos = [0,0]

    this.isMouseDown = false;
    this.isServerMouseDown = false;

    setInterval(() => {
      Application.instance.updateTick();
      Screen.renderFrame(this);
    }, 1000 / 60);

    window.onmousemove = (ev) => {
      this.mousePos = [ev.clientX, ev.clientY];
    }

    window.onmouseup = (ev) => {
      this.isMouseDown = false;

      CommandInputPacket.clientSend(this.connectionHandler.getSocket(), ..."summon item_entity".split(" "));
    }
    window.onmousedown = (ev) => {
      this.isMouseDown = true;
    }
  }

  addLog(type, message) {
    this.logs.push({type, message, transition: 1000, lifeTime: 10000})
  }

  setUsername(username) {
    this.username = username;
  }
}

export default Client;