const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

class LogsRenderer {
  constructor(screen) {
    this.screen = screen;

    this.pos = [0,0];
  }

  render() {
    let client = this.screen.client;
    
    let fontSize = 20;
    ctx.textAlign = "left";
    ctx.font = `${fontSize}px arial`;

    let logsHeight = client.logs.length * fontSize + fontSize / 2;
    let logsWidth = Math.max(...client.logs.map(value => ctx.measureText(`[${value.type}] ${value.message}`).width));

    if (logsWidth < 0) {
      logsWidth = 0;
    }

    ctx.fillStyle = `black`;
    ctx.fillRect(this.pos[0], this.pos[1], logsWidth, logsHeight);

    client.logs.forEach((log, i) => {
      let transition = log.lifeTime / log.transition;

      switch (log.type) {
        case "INFO": ctx.fillStyle = `rgba(255,255,255,${transition})`; break;
        case "ERROR": ctx.fillStyle = `rgba(255,0,0,${transition})`; break;
        case "WARNING": ctx.fillStyle = `rgba(255,223,0,${transition})`; break;
      }

      let height = i * fontSize;

      ctx.fillText(`[${log.type}] ${log.message}`, this.pos[0], this.pos[1] + fontSize + height);
    })
  }

  update(deltaTime) {
    this.screen.client.logs.forEach((log) => {
      log.lifeTime -= deltaTime;
    })

    this.screen.client.logs = this.screen.client.logs.filter((log) => log.lifeTime > 0);
  }
}

export default LogsRenderer;