class SpriteSheet {
  constructor({ path, spriteSize = [32,32], makeAlsoReversed = false }) {
    this.img = new Image();
    this.img.src = path;
    this.spriteSize = [...spriteSize];
    this.sheetSize = false;

    this.loaded = false;

    this.canvases = [];
    this.canvasesReversed = [];

    this.haveReversedSprites = makeAlsoReversed;

    this.type = "spriteSheet";

    this._onloadListeners = [];

    this.img.onload = () => {
      if (spriteSize === "height") {
        this.spriteSize = [this.img.height, this.img.height];
      }

      this.sheetSize = [Math.floor(this.img.width / this.spriteSize[0]), Math.floor(this.img.height / this.spriteSize[1])];

      while (this.sheetSize[1] < 1) {
        this.spriteSize[0] /= 2;
        this.spriteSize[1] /= 2;
        this.sheetSize = [Math.floor(this.img.width / this.spriteSize[0]), Math.floor(this.img.height / this.spriteSize[1])];
      }

      for (let x = 0; x < this.sheetSize[0]; x++) {
        for (let y = 0; y < this.sheetSize[1]; y++) {
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

          if (this.haveReversedSprites) {
            canvas = document.createElement("canvas");
            canvas.width = this.spriteSize[0];
            canvas.height = this.spriteSize[1];

            let ctx = canvas.getContext("2d");
            ctx.scale(-1, 1);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(this.img, -x * this.spriteSize[0] - this.spriteSize[0], -y * this.spriteSize[1]);
            ctx['imageSmoothingEnabled'] = false;       /* standard */
            ctx['mozImageSmoothingEnabled'] = false;    /* Firefox */
            ctx['oImageSmoothingEnabled'] = false;      /* Opera */
            ctx['webkitImageSmoothingEnabled'] = false; /* Safari */
            ctx['msImageSmoothingEnabled'] = false;     /* IE */

            if (!this.canvasesReversed[y]) {
              this.canvasesReversed[y] = []
            }

            this.canvasesReversed[y][x] = canvas;
          }
        }
      }
      this.loaded = true;

      this._onloadListeners.forEach((func) => {
        func(this);
      })
    }
  }

  get(x,y, reversed = false) {
    if (!this.loaded) {
      return false;
    }

    if (x >= this.sheetSize[0]) {
      console.error(`x out of bounds of spritesheet`);
      x = this.sheetSize[0] - 1;
    }

    if (y >= this.sheetSize[1]) {
      console.error(`y out of bounds of spritesheet`);
      y = this.sheetSize[1] - 1;
    }

    if (reversed && this.haveReversedSprites) {
      return this.canvasesReversed[y][x];
    }

    if (reversed) {
      console.error(`Can't get reversed. In constructor defined as no need to reverse.`)
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

  onload(func) {
    this._onloadListeners.push(func);
  }
}

export default SpriteSheet;