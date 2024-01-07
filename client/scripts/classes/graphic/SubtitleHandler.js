class SubtitleHandler {
  static fontSize = 25;
  static padding = 10;
  static subtitles = [];

  static render(canvas, ctx) {
    let pos = [canvas.width / 2, canvas.height - this.fontSize * 0.5 - this.getSubtitilesHeight()];

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

  static addSubtitle(invoker = "Unknown", text = "Empty", lifeTime = 3000) {
    this.subtitles.push({
      invoker,
      text,
      lifeTime,
      maxLifeTime: lifeTime
    });
  }

  static update(deltaTime) {
    this.subtitles.forEach((subtitle) => {
      subtitle.lifeTime -= deltaTime;
    })

    this.subtitles = this.subtitles.filter(subtitle => subtitle.lifeTime > 0);
  }

  static getSubtitilesHeight() {
    return this.fontSize * this.subtitles.length;
  }
}

export default SubtitleHandler;