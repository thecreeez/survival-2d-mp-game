class SpriteSheet {
  constructor({ path, spriteSize = [32,32], sheetSize = [4,4] }) {
    this.img = document.createElement("img");
    this.img.src = path;
    this.spriteSize = spriteSize;
    this.sheetSize = sheetSize;

    this.canvases = [];

    this.img.onload = () => {
      for (let x = 0; x < sheetSize[0]; x++) {
        for (let y = 0; y < sheetSize[1]; y++) {
          let canvas = document.createElement("canvas");
          canvas.width = this.spriteSize[0];
          canvas.height = this.spriteSize[1];

          let ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(this.img, -x * this.spriteSize[0], -y * this.spriteSize[1]);
          ctx['imageSmoothingEnabled'] = false;       /* standard */
          ctx['mozImageSmoothingEnabled'] = false;    /* Firefox */
          ctx['oImageSmoothingEnabled'] = false;      /* Opera */
          ctx['webkitImageSmoothingEnabled'] = false; /* Safari */
          ctx['msImageSmoothingEnabled'] = false;     /* IE */

          if (!this.canvases[y]) {
            this.canvases[y] = []
          }

          this.canvases[y][x] = canvas;
        }
      }
    }
  }

  get(x,y) {
    if (x > this.sheetSize[0] || y > this.sheetSize[1]) {
      console.error(`x or y out of bounds of spritesheet`);
      return this.canvas;
    }

    return this.canvases[y][x];
  }

  draw(ctx) {
    for (let x = 0; x < this.sheetSize[0]; x++) {
      for (let y = 0; y < this.sheetSize[1]; y++) {
        ctx.fillStyle = `black`;
        ctx.fillRect(x * 30, y * 30, 30, 30)
        ctx.drawImage(this.get(x,y), x * 30, y * 30, 30, 30);
      }
    }
  }
}

export default SpriteSheet;