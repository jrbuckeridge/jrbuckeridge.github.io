import leftButtonUrl from './img/controller/left-dark.png'
import rightButtonUrl from './img/controller/right-dark.png'
import upButtonUrl from './img/controller/up-dark.png'
import downButtonUrl from './img/controller/down-dark.png'
import leftButtonPressedUrl from './img/controller/left-transparent.png'
import rightButtonPressedUrl from './img/controller/right-transparent.png'
import upButtonPressedUrl from './img/controller/up-transparent.png'
import downButtonPressedUrl from './img/controller/down-transparent.png'
import attackButtonUrl from './img/controller/attack-dark.png'
import attackButtonPressedUrl from './img/controller/attack-transparent.png'
import {Size, HitBox} from "./hitbox.js";

/**
 * @type {Size} Vertical and horizontal buttons have the same size but rotated -90/90 degrees.
 */
const verticalButtonSize = new Size(61, 75);
const horizontalButtonSize = new Size(75, 61);
const attackButtonSize = new Size(80, 80);

/**
 * Returns an image object from a source.
 * @param src The source of the image (e.g. url, imported module).
 * @returns {HTMLImageElement} The image.
 */
function getImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

const upButton = getImage(upButtonUrl);
const upButtonPressed = getImage(upButtonPressedUrl);
const downButton = getImage(downButtonUrl);
const downButtonPressed = getImage(downButtonPressedUrl);
const leftButton = getImage(leftButtonUrl);
const leftButtonPressed = getImage(leftButtonPressedUrl);
const rightButton = getImage(rightButtonUrl);
const rightButtonPressed = getImage(rightButtonPressedUrl);

const attackButton = getImage(attackButtonUrl);
const attackButtonPressed = getImage(attackButtonPressedUrl);

/**
 * The atomic representation of all the controls when operated concurrently.
 */
export class Controls {
  constructor() {
    /**
     * 0: still, positive: going right, negative: going left.
     */
    this.horizontal = 0;
    /**
     * 0: still, positive: going down, negative: going up.
     */
    this.vertical = 0;
    /**
     * True when the controller is acted to attack. This doesn't mean the player is attacking.
     */
    this.attack = true;
  }
}

/**
 * An abstraction of inputs to pass to the player (e.g. keyboard presses, touch events).
 *
 * @deprecated This class emulates key presses and must be replaced by {Controls}.
 */
export class ControlInput {
  constructor(key, released) {
    /**
     * An action key.
     */
    this.key = key;
    /**
     * A boolean indicating if this action key was pressed or released.
     */
    this.released = released;
  }

}

/**
 * Controls the up/down/left/right input.
 */
export class DirectionController {
  /**
   * @param hero The main player.
   * @param directionsPosition The center position where the directional controls will be rendered.
   * @param actionsPosition The center position where the actions will be rendered (e.g. attack).
   */
  constructor(hero, directionsPosition, actionsPosition) {
    this.controls = new Controls();
    this.directionsPosition = directionsPosition;
    this.actionsPosition = actionsPosition;

    this.directionPointerId = undefined;
    this.attackPointerId = undefined;

    this.directionHitBoxes = undefined;
    this.attackHitBox = undefined;
    this.initControlHitBoxes();

    this.keyDownEventListener = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          this.controls.vertical = -1;
          break;
        case 'ArrowDown':
          this.controls.vertical = 1;
          break;
        case 'ArrowLeft':
          this.controls.horizontal = -1;
          break;
        case 'ArrowRight':
          this.controls.horizontal = 1;
          break;
        case ' ':
          this.controls.attack = true;
          break;
      }
      hero.handleInput({key: e.key, released: false});
    };

    this.keyUpEventListener = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (this.controls.vertical < 0) {
            this.controls.vertical = 0;
          }
          break;
        case 'ArrowDown':
          if (this.controls.vertical > 0) {
            this.controls.vertical = 0;
          }
          break;
        case 'ArrowLeft':
          if (this.controls.horizontal < 0) {
            this.controls.horizontal = 0;
          }
          break;
        case 'ArrowRight':
          if (this.controls.horizontal > 0) {
            this.controls.horizontal = 0;
          }
          break;
        case ' ':
          this.controls.attack = false;
          break;
      }
      hero.handleInput({key: e.key, released: true});
    };

    this.touchStartEventListener = (e) => {
      e.preventDefault();
      for (const touch of e.changedTouches) {
        const touchHitBox = new HitBox(touch.pageX - touch.radiusX / 2, touch.pageY - touch.radiusY / 2,
          touch.radiusX * 2, touch.radiusY * 2);
        // Direction
        if (this.directionPointerId === undefined) {
          // Up or down
          if (this.directionHitBoxes['up'].collidesWith(touchHitBox)) {
            this.directionPointerId = touch.identifier;
            this.controls.vertical = -1;
            hero.handleInput(new ControlInput('ArrowUp', false));
          } else if (this.directionHitBoxes['down'].collidesWith(touchHitBox)) {
            this.directionPointerId = touch.identifier;
            this.controls.vertical = 1;
            hero.handleInput(new ControlInput('ArrowDown', false));
          }

          // Left or right
          if (this.directionHitBoxes['left'].collidesWith(touchHitBox)) {
            this.directionPointerId = touch.identifier;
            this.controls.horizontal = -1;
            hero.handleInput(new ControlInput('ArrowLeft', false));
          } else if (this.directionHitBoxes['right'].collidesWith(touchHitBox)) {
            this.directionPointerId = touch.identifier;
            this.controls.horizontal = 1;
            hero.handleInput(new ControlInput('ArrowRight', false));
          }
        }

        // Attack
        if (this.attackPointerId === undefined && this.attackHitBox.collidesWith(touchHitBox)) {
          this.attackPointerId = touch.identifier;
          this.controls.attack = true;
          hero.handleInput(new ControlInput(' ', false));
        }
      }

      hero.handleControlsInput(this.controls);
    };

    this.touchEndEventListener = (e) => {
      e.preventDefault();
      for (const touch of e.changedTouches) {
        // Direction
        if (this.directionPointerId !== undefined && this.directionPointerId === touch.identifier) {
          this.directionPointerId = undefined;
          this.controls.horizontal = 0;
          this.controls.vertical = 0;
          // Simulate releasing all movement keys for now...
          hero.handleInput(new ControlInput('ArrowUp', true));
          hero.handleInput(new ControlInput('ArrowDown', true));
          hero.handleInput(new ControlInput('ArrowLeft', true));
          hero.handleInput(new ControlInput('ArrowRight', true));
        }

        // Attack
        if (this.attackPointerId !== undefined && this.attackPointerId === touch.identifier) {
          this.attackPointerId = undefined;
          this.controls.attack = false;
        }
      }
    };
    this.touchCancelEventListener = (e) => {
      e.preventDefault();
      for (const touch of e.changedTouches) {
        if (this.directionPointerId !== undefined && this.directionPointerId === touch.identifier) {
          this.directionPointerId = undefined;
          this.controls.horizontal = 0;
          this.controls.vertical = 0;
          // Simulate releasing all movement keys for now...
          hero.handleInput(new ControlInput('ArrowUp', true));
          hero.handleInput(new ControlInput('ArrowDown', true));
          hero.handleInput(new ControlInput('ArrowLeft', true));
          hero.handleInput(new ControlInput('ArrowRight', true));
        }

        if (this.attackPointerId !== undefined && this.attackPointerId === touch.identifier) {
          this.attackPointerId = undefined;
          this.controls.attack = false;
        }
      }
    };
  }

  registerListeners() {
    window.addEventListener('keydown', this.keyDownEventListener);
    window.addEventListener('keyup', this.keyUpEventListener);
    window.addEventListener('touchstart', this.touchStartEventListener);
    window.addEventListener('touchend', this.touchEndEventListener);
    window.addEventListener('touchcancel', this.touchCancelEventListener);

    window.addEventListener('touchmove', (e) => {
      e.preventDefault();
    });
  }

  unregisterListeners() {
    window.removeEventListener('keydown', this.keyDownEventListener);
    window.removeEventListener('keyup', this.keyUpEventListener);
    window.removeEventListener('touchstart', this.touchStartEventListener);
    window.removeEventListener('touchend', this.touchEndEventListener);
    window.removeEventListener('touchcancel', this.touchCancelEventListener);
  }

  initControlHitBoxes() {
    this.directionHitBoxes = {};
    this.directionHitBoxes['up'] = new HitBox(
      this.directionsPosition.x - horizontalButtonSize.width,
      this.directionsPosition.y - verticalButtonSize.height,
      horizontalButtonSize.width * 2,
      verticalButtonSize.height * 0.60
    );
    this.directionHitBoxes['down'] = new HitBox(
      this.directionsPosition.x - horizontalButtonSize.width,
      this.directionsPosition.y + verticalButtonSize.height * 0.40,
      horizontalButtonSize.width * 2,
      verticalButtonSize.height * 0.60
    );
    this.directionHitBoxes['left'] = new HitBox(
      this.directionsPosition.x - horizontalButtonSize.width,
      this.directionsPosition.y - verticalButtonSize.height,
      horizontalButtonSize.width * 0.60,
      verticalButtonSize.height * 2
    );
    this.directionHitBoxes['right'] = new HitBox(
      this.directionsPosition.x + horizontalButtonSize.width * 0.40,
      this.directionsPosition.y - verticalButtonSize.height,
      horizontalButtonSize.width * 0.60,
      verticalButtonSize.height * 2
    );

    // Attack button.
    this.attackHitBox = new HitBox(this.actionsPosition.x - attackButtonSize.width,
      this.actionsPosition.y - attackButtonSize.height/2,
      attackButtonSize.width,
      attackButtonSize.height);
  }

  resize(size, ratio) {
    this.directionsPosition.x = Math.floor(size.width * this.directionsPosition.xPercent / 100);
    this.directionsPosition.y = Math.floor(size.height * this.directionsPosition.yPercent / 100);

    this.actionsPosition.x = Math.floor(size.width * this.actionsPosition.xPercent / 100);
    this.actionsPosition.y = Math.floor(size.height * this.actionsPosition.yPercent / 100);
    this.initControlHitBoxes();
  }

  draw(context, deltaTime) {
    const up = this.controls.vertical < 0 ? upButtonPressed : upButton;
    const down = this.controls.vertical > 0 ? downButtonPressed : downButton;
    const left = this.controls.horizontal < 0 ? leftButtonPressed : leftButton;
    const right = this.controls.horizontal > 0 ? rightButtonPressed : rightButton;
    const attack = this.controls.attack ? attackButtonPressed : attackButton;

    // Draw vertically
    context.drawImage(up, 0, 0, verticalButtonSize.width, verticalButtonSize.height,
      this.directionsPosition.x - verticalButtonSize.width/2, this.directionsPosition.y - verticalButtonSize.height,
      verticalButtonSize.width, verticalButtonSize.height);
    context.drawImage(down, 0, 0, verticalButtonSize.width, verticalButtonSize.height,
      this.directionsPosition.x - verticalButtonSize.width/2, this.directionsPosition.y,
      verticalButtonSize.width, verticalButtonSize.height);

    // Draw horizontally
    context.drawImage(left, 0, 0, horizontalButtonSize.width, horizontalButtonSize.height,
      this.directionsPosition.x - horizontalButtonSize.width, this.directionsPosition.y - horizontalButtonSize.height/2,
      horizontalButtonSize.width, horizontalButtonSize.height);
    context.drawImage(right, 0, 0, horizontalButtonSize.width, horizontalButtonSize.height,
      this.directionsPosition.x, this.directionsPosition.y - horizontalButtonSize.height/2,
      horizontalButtonSize.width, horizontalButtonSize.height);

    // Attack button
    context.drawImage(attack, 0, 0, attackButtonSize.width, attackButtonSize.height,
      this.actionsPosition.x - attackButtonSize.width, this.actionsPosition.y - attackButtonSize.height/2,
      attackButtonSize.width, attackButtonSize.height);

    //Debug hit boxes
    this.debugDraw(context, this.directionHitBoxes['up']);
    this.debugDraw(context, this.directionHitBoxes['right']);
    this.debugDraw(context, this.directionHitBoxes['down']);
    this.debugDraw(context, this.directionHitBoxes['left']);
  }

  debugDraw(context, hitBox) {
    context.strokeRect(hitBox.x, hitBox.y, hitBox.width, hitBox.height);
  }

  update() {

  }
}
