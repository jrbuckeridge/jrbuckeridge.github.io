import Player from './player.js';
import {InputHandler} from "./input.js";
import {Level1, LevelDetails} from "./level.js";
import {Size} from "./hitbox.js";
import {Goal} from "./goal.js";
import {Score} from "./score.js";

window.onload = function () {
  new Game().start();
};

class Game {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.fontFamily = 'Bungee';
    this.size = new Size(this.canvas.width, this.canvas.height);
    this.soundOn = false;
    this.currentLevel = undefined;
    this.score = new Score();
    this.allGoals = [];
    this.currentGoalIndex = 0;
  }

  start() {
    let backgroundAudio = new Audio('sounds/Fun-Background.mp3');
    backgroundAudio.loop = true;

    window.addEventListener('keypress', (e) => {
      if (e.key === 's') {
        this.soundOn = !this.soundOn;
        if (this.soundOn) {
          backgroundAudio.play();
        } else {
          backgroundAudio.pause();
        }
      }
    });

    this.hero = new Player(this.canvas.width, this.canvas.height);
    const inputHandler = new InputHandler(this.hero);
    inputHandler.registerListeners();

    this.allGoals.push(new Goal(10));
    this.allGoals.push(new Goal(20, 5));
    this.allGoals.push(new Goal(35, 10));
    this.allGoals.push(new Goal(50, 30));
    this.allGoals.push(new Goal(60, 50));

    this.currentLevel = this.getCurrentLevel();

    let lastFrameTime = new Date().getTime();

    this.gameLoop = function() {
      this.context.clearRect(0, 0, this.size.width, this.size.height);
      const frameTime = new Date().getTime();
      const deltaTime = frameTime - lastFrameTime;
      // Keep reference to last frame
      lastFrameTime = frameTime;

      this.currentLevel.draw(this.context, deltaTime);
      this.currentLevel.update(deltaTime);

      // Request next frame
      requestAnimationFrame(this.gameLoop);
    }.bind(this);

    this.gameLoop();
  }

  getCurrentLevel() {
    return new Level1(this, new LevelDetails(this.currentGoalIndex + 1),
      this.hero, this.allGoals[this.currentGoalIndex]);
  }

  levelCompleted(level) {
    this.currentGoalIndex ++;
    this.currentLevel = this.getCurrentLevel();
    this.currentLevel.start(this.score);
  }
}
