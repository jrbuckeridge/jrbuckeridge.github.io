import {HitBox} from './hitbox.js';

export default class BatVillain {
  constructor(gameSize, batId) {
    this.gameWidth = gameSize.width;
    this.gameHeight = gameSize.height;

    this.oscillatingFactor = 1 + Math.random();
    this.oscillatingScalePercent = Math.random() * 0.05;
    this.yOffsetPercent = Math.random() < 0.5 ? 75 : 50;

    this.states = {};
    this.width = 1261;
    this.height = 747;
    this.scale = 0.1;

    this.states['flying'] = new FlyingState(this, 'img/villains/'+ batId +'/skeleton-flying_', 10);
    this.states['defeated'] = new DefeatedState(this, 'img/villains/'+ batId +'/skeleton-defeated_', 20);
    this.state = this.states['flying'];

    this.x = this.gameWidth * 1.1; // starts off screen
    this.y = this.gameHeight * 0.65; // bottom half of screen

    // Set to true when this villain shouldn't render anymore
    this.disabled = false;
    // Set to true when this villain has been defeated but it's still rendering
    this.defeated = false;
    this.scoreValue = 80 + Math.floor(Math.random() * 20);
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  resize(size, ratio) {
    this.gameWidth = size.width;
    this.gameHeight = size.height;
  }

  draw(context, deltaTime) {
    if (this.disabled) {
      return;
    }

    // 33.33ms corresponds to 30fps
    const frame = Math.floor(this.state.timeInState / 33.33) % this.state.images.length; // 30 fps

    context.drawImage(this.state.images[frame],
      0, 0, this.width, this.height,
      this.x, this.y, this.width * this.scale, this.height * this.scale);
  }

  update(deltaTime) {
    if (this.disabled) {
      return;
    }

    this.state.update(deltaTime)
  }

  tryDefeated() {
    this.state = this.states['defeated'];
    this.state.reset();
    this.defeated = true;
  }

  getHitBox() {
    return new HitBox(this.x + 30, this.y, (this.width - 500) * this.scale, (this.height - 250) * this.scale);
  }
};

class State {
  constructor(villain, imagePrefix, numStates) {
    this.villain = villain;
    this.images = [];

    // Assumes zero-based indexing (i.e. starting from 0).
    for (let i = 1; i <= numStates; i++) {
      const image = new Image();
      // Assumes a PNG extension
      image.src = imagePrefix + i + '.png';
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

class FlyingState extends State {
  constructor(villain, imagePrefix, numStates) {
    super(villain, imagePrefix, numStates);
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.villain.x -= (deltaTime * 0.15);
    const scale = this.villain.oscillatingScalePercent * this.villain.gameHeight / 100;
    this.villain.y = scale * Math.sin(this.villain.oscillatingFactor * this.timeInState / 100)
      + (this.villain.yOffsetPercent * this.villain.gameHeight / 100);
  }
}

class DefeatedState extends State {
  constructor(villain, imagePrefix, numStates) {
    super(villain, imagePrefix, numStates);
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (this.timeInState > 20 /*frames*/ * 33.33 /* ms/frame */) {
      this.villain.disabled = true;
    }
  }
}