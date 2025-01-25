export class ParallaxBackground {
  constructor(src, xScale, gameSize) {
    this.image = new Image();
    this.image.src = src;
    this.x = 0;
    this.xScale = xScale;
    // Harcoded ok
    this.width = 2048;
    this.height = 1536;
    this.gameSize = gameSize;
    this.aspectRatio = this.width / this.height;
  }

  resize(size, ratio) {
    this.gameSize = size;
  }

  computedWidth() {
    return this.gameSize.height * this.aspectRatio;
  }

  update(deltaTime) {
    //Moves left
    this.x -= (deltaTime * this.xScale);

    if (this.x >= this.width || this.x <= -this.width) {
      this.x = this.x % this.width;
    }
  }

  draw(context, deltaTime) {
    let dstX = Math.floor((this.width - this.x) * this.aspectRatio);
    context.drawImage(this.image,
      this.x, 0, this.width - this.x, this.height,
      0, 0, dstX, this.gameSize.height);

    if (dstX < this.gameSize.width) {
      // Draw again to cover window
      context.drawImage(this.image,
        0, 0, this.width, this.height,
        dstX, 0, dstX + Math.floor(this.width * this.aspectRatio), this.gameSize.height);
    }
  }
}