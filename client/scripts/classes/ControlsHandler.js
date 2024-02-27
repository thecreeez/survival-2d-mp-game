const canvas = document.querySelector("canvas");

import EventInvokePacket from "../../../core/packets/EventInvokePacket.js";
import Hotbar from "./graphic/Hotbar.js";
import MathUtils from "/core/utils/MathUtils.js"
import Vector from "/core/utils/Vector.js"

class ControlsHandler {
  constructor(client) {
    this.client = client;

    this.keys = {};
    this.prevKeys = {};

    this.mousePos = [0, 0];
    this.prevMousePos = [0, 0];
    this.deltaMousePos = [0, 0];

    this.hoverEntity = null;
    this.hoverEntityTime = 0;
    this.hoverEntityDataTag = "NETWORK"
    this.hoverEntityPinned = false;

    this.isMouseDown = false;
    this.bAttacking = false;

    this.vertical = 0;
    this.horizontal = 0;

    window.onkeydown = (ev) => {
      this.keys[ev.code] = true;
    }

    window.onkeyup = (ev) => {
      this.keys[ev.code] = false;
    }

    window.onmousemove = (ev) => {
      this.mousePos = [ev.clientX, ev.clientY];

      if (this.client.screen.hotbar.handleMouseMove(this.mousePos))
        return;

      if (!this.client.getPlayer()) {
        return;
      }

      let entitiesOnPos = this.client.getPlayer().getWorld().getEntitiesOnPos(this.client.screen.getMousePosOnWorld());

      if (this.hoverEntity === null && entitiesOnPos.length > 0) {
        this.hoverEntity = entitiesOnPos[0];
      }

      if (!this.hoverEntityPinned && !entitiesOnPos.includes(this.hoverEntity)) {
        this.hoverEntityTime = 0;
        this.hoverEntity = null;
      }
    }

    window.onmouseup = (ev) => {
      this.isMouseDown = false;

      let pos = [ev.clientX, ev.clientY];

      if (this.client.mapBuilder.handleMouseUp(pos))
        return;
    }

    window.onmousedown = (ev) => {
      this.isMouseDown = true;

      let pos = [ev.clientX, ev.clientY];

      if (this.client.screen.hotbar.handleMouseDown(pos))
        return;

      if (this.client.mapBuilder.handleMouseDown(pos))
        return;

      if (this.hoverEntity) {
        this.hoverEntityPinned = !this.hoverEntityPinned;
      }
    }
  }

  update(deltaTime) {
    this._updateAxis(deltaTime);
    this._updateSitting(); 
    this._updateAttack();

    if (this.keys["KeyP"] && !this.prevKeys["KeyP"]) {
      EventInvokePacket.clientSend(this.client.connectionHandler.getSocket(), "pause");
    }

    if (this.keys["KeyO"] && !this.prevKeys["KeyO"]) {
      this.client.application.debugMode = !this.client.application.debugMode;
      this.client.screen.profiler.set("debugMode", this.client.application.debugMode);
    }

    this.deltaMousePos[0] = this.mousePos[0] - this.prevMousePos[0];
    this.deltaMousePos[1] = this.mousePos[1] - this.prevMousePos[1];

    this.prevMousePos = this.mousePos;

    if (this.hoverEntity !== null) {
      this.hoverEntityTime += deltaTime;
    }

    for (let key in this.keys) {
      this.prevKeys[key] = this.keys[key];
    }
  }

  _updateAttack() {
    if (this.keys["Space"]) {
      this.bAttacking = true;
    } else {
      this.bAttacking = false;
    }
  }

  _updateSitting() {
    if (this.keys["ShiftLeft"]) {
      this.bSitting = true;
    } else {
      this.bSitting = false;
    }
  }

  _updateAxis(deltaTime) {
    let axis = [0, 0];

    if (this.keys["KeyW"]) {
      axis[1]++;
    }

    if (this.keys["KeyS"]) {
      axis[1]--;
    }

    if (this.keys["KeyA"]) {
      axis[0]--;
    }

    if (this.keys["KeyD"]) {
      axis[0]++;
    }

    if (axis[0] > 0) {
      this.horizontal = Math.min(this.horizontal + deltaTime / 200, 1);
    } else if (axis[0] < 0) {
      this.horizontal = Math.max(this.horizontal - deltaTime / 200, -1);
    } else if (this.horizontal > 0) {
      this.horizontal = Math.max(this.horizontal - deltaTime / 200, 0);
    } else if (this.horizontal < 0) {
      this.horizontal = Math.min(this.horizontal + deltaTime / 200, 0);
    }

    if (axis[1] > 0) {
      this.vertical = Math.min(this.vertical + deltaTime / 200, 1);
    } else if (axis[1] < 0) {
      this.vertical = Math.max(this.vertical - deltaTime / 200, -1);
    } else if (this.vertical > 0) {
      this.vertical = Math.max(this.vertical - deltaTime / 200, 0);
    } else if (this.vertical < 0) {
      this.vertical = Math.min(this.vertical + deltaTime / 200, 0);
    }
  }

  calculateAimRotation() {
    let direction = [this.mousePos[0] - canvas.width / 2, this.mousePos[1] - canvas.height / 2];
    let rotation = new Vector(direction).getAngle();

    return rotation;
  }
}

export default ControlsHandler;