import {IdleState, JumpState, RunState, AttackState, CrouchState, FaintState, HurtState} from "./hero-state.js";
import {HitBox} from './hitbox.js';

const MAX_LIFE = 100;

export default class Hero {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.states = {};

    this.states['idle'] = new IdleState(this);
    this.states['jump'] = new JumpState(this);
    this.states['run'] = new RunState(this);
    this.states['attack'] = new AttackState(this);
    this.states['crouch'] = new CrouchState(this);
    this.states['faint'] = new FaintState(this);
    this.states['hurt'] = new HurtState(this);

    this.state = this.states['idle'];
    this.initialXPosition = this.gameWidth * 0.25 - this.state.size.width/2;
    this.x = this.initialXPosition;
    this.y = this.gameHeight - this.state.size.height;

    // Allows to move the hero
    this.speedX = 0;
    this.speedY = 0;

    this.life = MAX_LIFE;
    this.gameOver = false;
  }

  draw(context, deltaTime) {
    // 33.33ms corresponds to 30fps
    const frame = Math.floor(this.state.timeInState / 33.33) % this.state.images.length; // 30 fps

    context.drawImage(this.state.images[frame],
      0, 0, this.state.size.width, this.state.size.height,
      this.x, this.y, this.state.size.scaledWidth, this.state.size.scaledHeight);
  }

  update(deltaTime) {
    if (this.gameOver) {
      return;
    }

    this.state.update(deltaTime);
    this.x += this.speedX;
    this.y += this.speedY;
    // Max Y position
    if (this.y < this.gameHeight * 0.05) {
      this.y = this.gameHeight * 0.05;
    } else if (this.y > this.gameHeight - this.state.size.height) {
      this.y = this.gameHeight - this.state.size.height;
    }
  }

  handleInput(keyInput) {
    this.state.handleInput(keyInput);
  }

  tryJump() {
    this.setState('jump');
  }

  tryIdle() {
    this.setState('idle');
  }

  tryRun() {
    this.setState('run');
  }

  tryAttack() {
    this.setState('attack');
  }

  tryGetHit() {
    if (this.state.id === 'hurt') {
      // Cannot get hit multiple times while in this state
      return;
    }

    this.life -= 15;
    if (this.life < 0) {
      this.life = 0;
    }
    if (this.isDefeated()) {
      this.setState('faint');
    } else {
      this.setState('hurt');
    }
  }

  tryCrouch() {
    this.setState('crouch');
  }

  isAttacking() {
    return this.state === this.states['attack'];
  }

  setState(stateId) {
    this.state = this.states[stateId];
    this.state.reset();
    this.y = this.gameHeight - this.state.size.height;
  }

  getHitBox() {
    let stateHitBox = this.state.getHitBox();
    return new HitBox(this.x + stateHitBox.x, this.y + this.speedY + stateHitBox.y,
      stateHitBox.width, stateHitBox.height);
  }

  increaseLife(value) {
    this.life += value;
    if (this.life > MAX_LIFE) {
      this.life = MAX_LIFE;
    }
  }

  isDefeated() {
    return this.life <= 0;
  }
};