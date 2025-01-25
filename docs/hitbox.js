/**
 * A rectangular area to determine collisions.
 */
export class HitBox {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Returns a scaled copy of this hitbox.
   * @param scale The scale factor.
   * @returns {HitBox} A scaled copy of the original element.
   */
  scaled(scale) {
    return new HitBox(this.x * scale, this.y * scale,
      this.width * scale, this.height * scale);
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