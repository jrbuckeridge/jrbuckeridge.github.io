export class KeyInput {
  constructor(key, released) {
    this.key = key;
    this.released = released;
  }
}

export class InputHandler {
  constructor(player) {
    this.keyDownEventListener = (e) => {
      player.handleInput({key: e.key, released: false});
    };

    this.keyUpEventListener = (e) => {
      player.handleInput({key: e.key, released: true});
    };
  }

  registerListeners() {
    window.addEventListener('keydown', this.keyDownEventListener);
    window.addEventListener('keyup', this.keyUpEventListener);
  }

  unregisterListeners() {
    window.removeEventListener('keydown', this.keyDownEventListener);
    window.removeEventListener('keyup', this.keyUpEventListener);
  }
}