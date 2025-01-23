import {HitBox} from "./hitbox.js";

// The horizontal player speed when running
const RUN_X_SPEED = 5;
const MAX_X_SPEED = 10;
const JUMP_Y_SPEED_DELTA = 2;

class GirlHeroState {
  constructor(player, stateId, imagePrefix, numFrames, size, hitBox) {
    this.player = player;
    this.id = stateId;
    this.numFrames = numFrames;
    this.images = [];

    // Assumes natural indexing (i.e. starting from 1)
    for (let i = 1; i <= numFrames; i++) {
      const image = new Image();
      // Assumes a PNG extension
      const paddedSuffix = String(i).padStart(2, '0');
      image.src = imagePrefix + paddedSuffix + '.png';
      this.images.push(image);
    }
    this.size = size;
    this.size.scale = this.size.scale || 1;
    this.size.scaledWidth = this.size.width * this.size.scale;
    this.size.scaledHeight = this.size.height * this.size.scale;
    this.timeInState = 0;
    this.hitBox = hitBox;
  }

  reset() {
    this.timeInState = 0;
  }

  getHitBox() {
    // Offset the hit box depending on sprites
    return this.hitBox;
  }
}

export class IdleState extends GirlHeroState {
  constructor(player) {
    super(player, 'idle', 'img/hero-girl/Golden_Kunoichi_Idle_', 8, {width: 200, height: 300, scale: 1},
      new HitBox(50, 50, 100, 225));
  }

  handleInput(keyInput) {
    if (keyInput.released) {
      return;
    }

    switch (keyInput.key) {
      case 'ArrowUp':
        this.player.tryJump();
        break;
      case 'ArrowDown':
        this.player.tryCrouch();
        break;
      case 'ArrowRight':
        this.player.tryRun();
        break;
      case ' ':
        this.player.tryAttack();
        break;
    }
  }

  update(deltaTime) {
    this.timeInState += (deltaTime * 0.5);
    this.player.speedY = 0;
    if (this.player.speedX > 0) {
      this.player.speedX -= RUN_X_SPEED;
    } else if (this.player.x > this.player.initialXPosition) {
      this.player.x -= 5;
    }
  }
}

export class JumpState extends GirlHeroState {
  constructor(player) {
    super(player, 'jump', 'img/hero-girl/Golden_Kunoichi_Jump_', 14, {width: 250, height: 300, scale: 1},
      new HitBox(50, 50, 150, 150));
    // 233.31 is equivalent to 7 frames at 30fps
    this.allowedTimeInState = 2 * 233.31;
  }

  handleInput(keyInput) {

  }

  update(deltaTime) {
    this.timeInState += (deltaTime * 0.75);
    if (this.timeInState < this.allowedTimeInState / 2) {
      this.player.speedY = -30;
    } else if (this.timeInState >= this.allowedTimeInState / 2 && this.timeInState < this.allowedTimeInState) {
      this.player.speedY = 30;
    } else {
      // Reset vertical speed because we try to end a frame before
      this.player.speedY = 0;
      this.player.tryIdle();
    }
  }
}

export class RunState extends GirlHeroState {
  constructor(player) {
    super(player, 'run', 'img/hero-girl/Golden_Kunoichi_Run_', 8, {width: 250, height: 300, scale: 1},
      new HitBox(50, 50, 150, 225));
  }

  handleInput(keyInput) {
    if (!keyInput.released) {
      // Key pressed
      switch (keyInput.key) {
        case 'ArrowUp':
          this.player.tryJump();
          break;
        case ' ':
          this.player.tryAttack();
          break;
      }

      // Return to avoid processing key releases
      return;
    }

    // Key released
    switch (keyInput.key) {
      case 'ArrowRight':
        this.player.tryIdle();
        break;
    }

  }

  update(deltaTime) {
    this.timeInState += deltaTime;
    this.player.speedY = 0;
    if (this.player.speedX < MAX_X_SPEED) {
      this.player.speedX += RUN_X_SPEED;
    }
  }
}

export class AttackState extends GirlHeroState {
  constructor(player) {
    super(player, 'attack', 'img/hero-girl/Golden_Kunoichi_Attack_', 17, {width: 500, height: 350, scale: 1},
      new HitBox(200, 50, 250, 250));
    this.sounds = [];
    const sources = ['sounds/swish-9.wav', 'sounds/swish-10.wav'];
    sources.forEach((source) => {
      const audio = new Audio();
      audio.src = source;
      this.sounds.push(audio);
    });
  }

  reset() {
    super.reset();
    this.sounds[0].play();
  }

  handleInput(keyInput) {
    // no-op
  }

  update(deltaTime) {
    this.timeInState += deltaTime;
    this.player.speedX = 0;
    this.player.speedY = 0;
    if (this.timeInState >= 566) {
      // After this elapsed time in milliseconds, return to idle state.
      // 17 frames @ 30 fps
      this.player.tryIdle();
    }
  }
}

export class HurtState extends GirlHeroState {
  constructor(player) {
    super(player, 'hurt', 'img/hero-girl/Golden_Kunoichi_Hurt_', 3, {width: 200, height: 300, scale: 1},
      new HitBox(0, 0, 0, 0));
    this.sounds = [];
    const sources = ['sounds/blub_hurt.wav'];
    sources.forEach((source) => {
      const audio = new Audio();
      audio.src = source;
      this.sounds.push(audio);
    });
  }

  reset() {
    super.reset();
    this.sounds[0].play();
  }

  handleInput(keyInput) {
    // no-op
  }

  update(deltaTime) {
    this.timeInState += deltaTime;
    this.player.speedX = 0;
    this.player.speedY = 0;
    if (this.timeInState >= 500) {
      // After this elapsed time in milliseconds, return to idle state.
      this.player.tryIdle();
    }
  }
}


export class FaintState extends GirlHeroState {
  constructor(player) {
    super(player, 'faint', 'img/hero-girl/Golden_Kunoichi_Faint_', 14, {width: 250, height: 300, scale: 1},
      new HitBox(0, 0, 0, 0));
    this.sounds = [];
    const sources = ['sounds/blub_hurt.wav'];
    sources.forEach((source) => {
      const audio = new Audio();
      audio.src = source;
      this.sounds.push(audio);
    });
  }

  reset() {
    super.reset();
    this.sounds[0].play();
  }

  handleInput(keyInput) {
    // no-op
  }

  update(deltaTime) {
    this.timeInState += (deltaTime * 0.25); // slow down time when player dies
    this.player.speedX = 0;
    this.player.speedY = 0;
    if (this.timeInState >= 450) {
      // After this elapsed time in milliseconds, game is over.
      this.player.gameOver = true;
    }
  }
}

export class CrouchState extends GirlHeroState {
  constructor(player) {
    super(player, 'crouch', 'img/hero-girl/Golden_Kunoichi_Crouch_', 2, {width: 200, height: 300, scale: 1},
      new HitBox(50, 125, 100, 100));
  }

  handleInput(keyInput) {
    if (!keyInput.released) {
      return;
    }

    switch (keyInput.key) {
      case 'ArrowDown':
        this.player.tryIdle();
        break;
    }
  }

  update(deltaTime) {
    this.timeInState += deltaTime * 0.10;
    this.player.speedX = 0;
    this.player.speedY = 0;
  }
}

