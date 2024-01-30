const canvas = document.querySelector("canvas");

import Hotbar from "./graphic/Hotbar.js";
import MathUtils from "/core/utils/MathUtils.js"
import Vector from "/core/utils/Vector.js"

class ControlsHandler {
  constructor(client) {
    this.client = client;

    this.keys = {};

    this.mousePos = [0, 0];
    this.prevMousePos = [0, 0];
    this.deltaMousePos = [0, 0];

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

      if (Hotbar.handleMouseMove(this.mousePos))
        return;
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

      if (Hotbar.handleMouseDown(pos))
        return;

      if (this.client.mapBuilder.handleMouseDown(pos))
        return;
    }
  }

  update(deltaTime) {
    this._updateAxis(deltaTime);
    this._updateSitting(); 
    this._updateAttack();

    this.deltaMousePos[0] = this.mousePos[0] - this.prevMousePos[0];
    this.deltaMousePos[1] = this.mousePos[1] - this.prevMousePos[1];

    this.prevMousePos = this.mousePos;
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

    this.horizontal = axis[0];
    this.vertical = axis[1];
    return;

    if (axis[0] > 0)
      this.horizontal = Math.min(this.horizontal + deltaTime * 5, 1);
    else if (axis[0] < 0)
      this.horizontal = Math.max(this.horizontal - deltaTime * 5, -1);

    if (axis[1] > 0)
      this.vertical = Math.min(this.vertical + deltaTime * 5, 1);
    else if (axis[1] < 0)
      this.vertical = Math.max(this.vertical - deltaTime * 5, -1);
  }

  calculateAimRotation() {
    let direction = [this.mousePos[0] - canvas.width / 2, this.mousePos[1] - canvas.height / 2];
    let rotation = new Vector(direction).getAngle();

    return rotation;
  }
}

export default ControlsHandler;