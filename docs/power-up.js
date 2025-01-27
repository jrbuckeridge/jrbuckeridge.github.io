import {Size, HitBox} from './hitbox.js';

class PowerUp {
  constructor(gameWidth, gameHeight, size, spriteConfig) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.states = {};
    this.size = size;

    this.states['moving'] = new MovingState(this, spriteConfig);
    this.state = this.states['moving'];

    this.x = this.gameWidth * 1.1; // starts offscreen
    this.yOffsetPercent = 55 + (Math.random() - 0.5) * 30;
    this.y = this.gameHeight * this.yOffsetPercent / 100;

    // Set to true when this power-up shouldn't render anymore
    this.disabled = false;
    this.scoreValue = 0;
    this.lifeValue = 0;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  resize(size, ratio) {
    this.gameWidth = size.width;
    this.gameHeight = size.height;
    this.y = this.gameHeight * this.yOffsetPercent / 100;
  }

  draw(context, deltaTime) {
    if (this.disabled) {
      return;
    }

    // 33.33ms corresponds to 30fps
    const frame = Math.floor(this.state.timeInState / 33.33) % this.state.images.length; // 30 fps

    context.drawImage(this.state.images[frame],
      0, 0, this.size.width, this.size.height,
      this.x, this.y, this.size.width * this.size.scale, this.size.height * this.size.scale);
  }

  update(deltaTime) {
    if (this.disabled) {
      return;
    }

    this.state.update(deltaTime)
  }

  tryCapture() {
    this.disabled = true;
  }

  getHitBox() {
    return new HitBox(this.x, this.y, this.size.width * this.size.scale, this.size.height * this.size.scale);
  }
}

export class Coin extends PowerUp {
  constructor(gameSize) {
    super(gameSize.width, gameSize.height, new Size(266, 268, 0.20),
      {imagePrefix: 'img/coins/gold-coins/frame-', numStates: 8});
    this.scoreValue = 20 + Math.floor(Math.random() * 20);
    this.lifeValue = 15;
  }
}

export class Health extends PowerUp {
  constructor(gameSize) {
    super(gameSize.width, gameSize.height, new Size(299, 297, 0.15),
      {imagePrefix: 'img/health/red-health/frame-', numStates: 6});
    this.scoreValue = 0;
    this.lifeValue = 15;
  }
}

class State {
  constructor(powerUp, spriteConfig) {
    this.powerUp = powerUp;
    this.images = [];

    // Assumes zero-based indexing (i.e. starting from 0).
    for (let i = 1; i <= spriteConfig.numStates; i++) {
      const image = new Image();
      // Assumes a PNG extension
      image.src = spriteConfig.imagePrefix + i + '.png';
      this.images.push(image);
    }

    this.timeInState = 0;
  }

  reset() {
    this.timeInState = 0;
  }

  update(deltaTime) {
    this.timeInState += deltaTime;
  }
}

export class MovingState extends State {
  constructor(powerUp, spriteConfig) {
    super(powerUp, spriteConfig);
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.powerUp.x -= (deltaTime * 0.2);
  }
}
