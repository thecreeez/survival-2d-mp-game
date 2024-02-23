const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

export default class Profiler {
  constructor(screen) {
    this.screen = screen;
    this.pos = [10, canvas.height / 2];

    this.profiles = {};
  }

  render() {
    this.pos = [10, canvas.height / 2];

    let dataFontSize = 15;
    ctx.font = `${dataFontSize}px arial`;
    ctx.textAlign = "left";
    ctx.fillStyle = `white`;

    let i = 1;
    ctx.fillText(`Render profiler:`, this.pos[0], this.pos[1] + dataFontSize);
    for (let profile in this.profiles) {
      ctx.fillText(`${profile}: ${this.profiles[profile]}`, this.pos[0], this.pos[1] + i * dataFontSize + dataFontSize);
      i++;
    }
  }

  clear() {
    this.profiles = {};
  }

  start(name) {
    this.profiles[name] = Date.now();
  }

  stop(name) {
    this.profiles[name] = Date.now() - this.profiles[name];
  }

  set(field, value) {
    this.profiles[field] = value;
  }
}