export class HitBox {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  collidesWith(hitBox) {
    return this.x < hitBox.x + hitBox.width &&
      this.x + this.width > hitBox.x &&
      this.y < hitBox.y + hitBox.height &&
      this.y + this.height > hitBox.y;
  }
}

export class Size {
  constructor(width, height, scale) {
    this.width = width;
    this.height = height;
    this.scale = scale || 1;
  }
}