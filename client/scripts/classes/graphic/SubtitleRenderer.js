const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

class SubtitleHandler {
  constructor(screen) {
    this.screen = screen;

    this.fontSize = 25;
    this.padding = 10;
    this.subtitles = [];
  }

  render() {
    let pos = [canvas.width / 2, canvas.height - this.fontSize * 0.5 - this.getSubtitilesHeight() - 50];

    ctx.textAlign = `center`;
    ctx.font = `${this.fontSize}px arial`;

    this.subtitles.forEach((subtitle, i) => {
      let width = ctx.measureText(`${subtitle.invoker}: ${subtitle.text}`).width;

      ctx.fillStyle = `black`;
      ctx.fillRect(pos[0] - width / 2 - this.padding, pos[1] - this.fontSize - i * this.fontSize, width + this.padding * 2, this.fontSize + this.padding);
      ctx.fillStyle = `white`;
      ctx.fillText(`${subtitle.invoker}: ${subtitle.text}`, pos[0], pos[1] - i * this.fontSize);
    })
  }

  addSubtitle(invoker = "Unknown", text = "Empty", lifeTime = 3000) {
    this.subtitles.push({
      invoker,
      text,
      lifeTime,
      maxLifeTime: lifeTime
    });
  }

  update(deltaTime) {
    this.subtitles.forEach((subtitle) => {
      subtitle.lifeTime -= deltaTime;
    })

    this.subtitles = this.subtitles.filter(subtitle => subtitle.lifeTime > 0);
  }

  getSubtitilesHeight() {
    return this.fontSize * this.subtitles.length;
  }
}

export default SubtitleHandler;