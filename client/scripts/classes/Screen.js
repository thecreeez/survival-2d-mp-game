import CLIENT_INSTANCE from "../init.js";
import Client from "./Client.js";

import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const canvas = document.querySelector("canvas");

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

window.onresize = (ev) => {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
}

class Screen {
  static lastFrame = Date.now();

  static createScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.controls = new PointerLockControls(this.camera, document.body);
    this.models = {};

    this.controls.addEventListener('lock', function () {
      // menu hide
    });

    this.controls.addEventListener('unlock', function () {
      // menu show
    });

    canvas.onclick = (ev) => {
      this.controls.lock();
    }
  }

  // model: Mesh
  static addModelOnScene(uuid, model) {
    this.scene.add(model.getMesh());
    this.models[uuid] = model;

    console.log(this.models);
  }

  static removeModelFromScene(uuid) {
    this.scene.remove(this.models[uuid].getMesh());
    delete this.models[uuid];
  }

  static getModelByUuid(uuid) {
    return this.models[uuid];
  }

  /**
   * 
   * @param {Client} client 
   */
  static renderFrame(client) {
    renderer.render(this.scene, this.camera);
    //this.renderLogs(client, Date.now() - this.lastFrame);
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