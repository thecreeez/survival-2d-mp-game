import Screen from "./Screen.js";

const canvas = document.querySelector("canvas");

class ControlsHandler {
  constructor(client) {
    this.client = client;

    this.keys = {};
    this.mousePos = [0, 0];
    this.isMouseDown = false;

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
    }

    window.onmouseup = (ev) => {
      this.isMouseDown = false;
    }

    window.onmousedown = (ev) => {
      this.isMouseDown = true;
    }
  }

  update(deltaTime) {
    this._updateAxis(deltaTime);
    this._updateSitting();
  }

  _updateSitting() {
    if (this.keys["Shift"]) {
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
}

export default ControlsHandler;