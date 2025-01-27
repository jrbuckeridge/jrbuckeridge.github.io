import {ParallaxBackground} from "./background.js";
import BatVillain from "./villain.js";
import {Coin, Health} from "./power-up.js";
import {DirectionController} from "./controller.js";

/**
 * Base representation of a game level.
 */
class Level {
  constructor(game, levelDetails, hero, goals) {
    this.game = game;
    this.context = game.context;
    this.levelDetails = levelDetails;
    this.hero = hero;
    this.goals = goals;

    this.controller = new DirectionController(hero, {
      x: game.size.width * 0.10,
      y: game.size.height * 0.90,
      xPercent: 10,
      yPercent: 90
    }, {
      x: game.size.width * 0.90,
      y: game.size.height * 0.95,
      xPercent: 95,
      yPercent: 90
    });
    this.controller.registerListeners();

    this.backgrounds = [];
    this.villains = [];
    this.coins = [];
    this.powerUps = [];

    /**
     * The computed target goals when the level starts taking into account the initial player state.
     */
    this.targetGoal = goals;
    this.resize(this.game.size, this.game.ratio);
  }

  isLevelCompleted () {
    return this.targetGoal.isAchieved(this.game.score);
  }

  start(score) {
    this.targetGoal = this.goals.add(score);
  }

  resize(size, ratio) {
    const scaledFontSize = Math.floor(20 * ratio.xScale);
    this.context.font = `${scaledFontSize}px Bungee`;
    this.hero.resize(size, ratio);
    this.controller.resize(size, ratio);
  }
}

/**
 * Level specific details.
 */
export class LevelDetails {
  /**
   * @param levelNumber The number representing this level (e.g. 1, 2, 3, ...)
   */
  constructor(levelNumber) {
    this.levelNumber = levelNumber;
  }
}

/**
 * The first level type in the game.
 */
export class Level1 extends Level {
  constructor(game, levelDetails, hero, goals) {
    super(game, levelDetails, hero, goals);

    this.renderGoals = true;
    this.renderGoalsKeyListener = () => {
      this.renderGoals = false;
      window.removeEventListener('keypress', this.renderGoalsKeyListener);
      window.removeEventListener('touchstart', this.renderGoalsTouchListener);
    };
    this.renderGoalsTouchListener = () => {
      this.renderGoals = false;
      window.removeEventListener('keypress', this.renderGoalsKeyListener);
      window.removeEventListener('touchstart', this.renderGoalsTouchListener);
    };
    window.addEventListener('keypress', this.renderGoalsKeyListener);
    window.addEventListener('touchstart', this.renderGoalsTouchListener);

    // Solid background
    this.backgrounds.push(new ParallaxBackground('img/background/nature-landscape/layer-1.png', 0, game.size));
    // Clouds
    this.backgrounds.push(new ParallaxBackground('img/background/nature-landscape/layer-2.png', -0.05, game.size));
    // Big mountains
    this.backgrounds.push(new ParallaxBackground('img/background/nature-landscape/layer-3.png', -0.10, game.size));
    // Small mountains
    this.backgrounds.push(new ParallaxBackground('img/background/nature-landscape/layer-4.png', -0.15, game.size));
    // Rocks
    this.backgrounds.push(new ParallaxBackground('img/background/nature-landscape/layer-5.png', -0.25, game.size));
    // Bushes
    this.backgrounds.push(new ParallaxBackground('img/background/nature-landscape/layer-6.png', -0.25, game.size));
    // Terrain
    this.backgrounds.push(new ParallaxBackground('img/background/nature-landscape/layer-7.png', -0.5, game.size));

    const numVillains = 50;
    const batIds = ['bat01', 'bat02', 'bat03'];
    for (let i = 1; i <= numVillains; i++) {
      let villain = new BatVillain(game.size,
        batIds[Math.floor((Math.random() * 100) % batIds.length)]);
      villain.setPosition(
        game.size.width * 1.1 + (this.game.size.width * 0.5 * i) + (Math.random() - 0.5) * 50,
        this.game.size.height / 2 + (Math.random() - 0.5) * 200);
      this.villains.push(villain);
    }

    const numCoins = 100;
    for (let i = 1; i <= numCoins; i++) {
      let coin = new Coin(this.game.size);
      coin.setPosition(
        this.game.size.width * 1.1 + (this.game.size.width * 0.25 * i) + (Math.random() - 0.5) * 50, coin.y);
      this.coins.push(coin);
    }

    const numPowerUps = Math.floor(numVillains / 15);
    for (let i = 1; i <= numPowerUps; i++) {
      let powerUp = new Health(this.game.size);
      powerUp.setPosition(
        this.villains[i * 15 - 1].x + (Math.random() - 0.5) * 50,
        this.game.size.height / 2);
      this.powerUps.push(powerUp);
    }
  }

  resize(size, ratio) {
    super.resize(size, ratio);
    for (let b of this.backgrounds) {
      b.resize(size, ratio);
    }
    for (let v of this.villains) {
      v.resize(size, ratio);
      v.setPosition(v.x, this.game.size.height * 0.5);
    }
    for (let c of this.coins) {
      c.resize(size, ratio);
    }
    for (let h of this.powerUps) {
      h.resize(size, ratio);
    }
  }

  renderLevelGoals(context, deltaTime) {
    // Assume first background is solid color
    this.backgrounds[0].draw(context, deltaTime);
    // Update coins
    this.context.save();
    this.context.textAlign = 'center';
    this.context.fillText(`Level ${this.levelDetails.levelNumber}`, this.game.size.width * 0.5, this.game.size.height * 0.30);
    this.context.fillText(`Collect ${this.goals.coins} coins`, this.game.size.width * 0.5, this.game.size.height * 0.40);
    const coin = new Coin(this.game.size);
    coin.setPosition(this.game.size.width * 0.325, this.game.size.height * 0.39 - 36);
    coin.draw(context, 0);
    if (this.goals.defeatedVillains > 0) {
      this.context.fillText(`Defeat ${this.goals.defeatedVillains} villains`, this.game.size.width * 0.5, this.game.size.height * 0.50);
      const villain = new BatVillain(this.game.size, 'bat01');
      villain.setPosition(this.game.size.width * 0.285, this.game.size.height * 0.5);
      villain.draw(context, 0);
    }
    this.context.restore();
  }

  draw(context, deltaTime) {
    if (this.renderGoals) {
      this.renderLevelGoals(context, deltaTime);
      return;
    }

    //Draw backgrounds
    for (let b of this.backgrounds) {
      b.draw(this.context, deltaTime);
    }

    // Draw villains
    for (let v of this.villains) {
      v.draw(this.context, deltaTime);
      // // Debug with hit boxes
      // const debugHitBox = v.getHitBox();
      // context.strokeRect(debugHitBox.x, debugHitBox.y, debugHitBox.width, debugHitBox.height);
    }

    // Draw coins
    for (let coin of this.coins) {
      coin.draw(this.context, deltaTime);
    }
    // Draw power-ups
    for (let powerUp of this.powerUps) {
      powerUp.draw(this.context, deltaTime);
    }

    // Draw hero
    this.hero.draw(this.context, deltaTime);
    // // Debug with hit boxes
    // const debugHitBox = this.hero.getHitBox();
    // context.strokeRect(debugHitBox.x, debugHitBox.y, debugHitBox.width, debugHitBox.height);

    // Draw controller last so it always shows up
    this.controller.draw(context, deltaTime);
  }

  update(deltaTime) {
    if (this.renderGoals) {
      // Don't update models while rendering goals
      return;
    }

    if (this.isLevelCompleted()) {
      this.game.levelCompleted(this);
      return;
    }

    //Update backgrounds
    for (let b of this.backgrounds) {
      b.update(deltaTime);
    }
    // Update villains
    for (let v of this.villains) {
      v.update(deltaTime);
    }
    // Update coins
    for (let coin of this.coins) {
      coin.update(deltaTime);
    }
    // Draw powerUp power-ups
    for (let powerUp of this.powerUps) {
      powerUp.update(deltaTime);
    }
    // Update hero
    this.hero.update(deltaTime);

    // Update score
    this.context.fillText(`Score: ${this.game.score.points}`, this.game.size.width * 0.025, this.game.size.height * 0.10);
    // Update coins
    this.context.fillText(`Coins: ${this.game.score.coins}`, this.game.size.width * 0.025, this.game.size.height * 0.15);
    // Update villains
    this.context.fillText(`Villains: ${this.game.score.defeatedVillains}`, this.game.size.width * 0.025, this.game.size.height * 0.20);
    // Update life
    this.context.fillText(`Life: ${this.hero.life}`, this.game.size.width * 0.025, this.game.size.height * 0.25);
    // Update sound
    this.context.fillText(`Sound: ${this.game.soundOn ? 'On' : 'Off'}`, this.game.size.width * 0.025, this.game.size.height * 0.30);

    if (!this.hero.isDefeated()) {
      // Check for collisions between hero and villain
      for (let v of this.villains) {
        if (v.defeated || v.disabled) {
          continue;
        }

        const hitBox = this.hero.getHitBox();
        const targetHitBox = v.getHitBox();

        if (hitBox.collidesWith(targetHitBox)) {
          if (this.hero.isAttacking()) {
            v.tryDefeated();
            this.game.score.defeatedVillain(v);
          } else {
            this.hero.tryGetHit();
          }
        }
      }

      // Check for collisions between hero and coins
      for (let coin of this.coins) {
        if (coin.disabled) {
          continue;
        }

        if (this.hero.isAttacking()) {
          // Don't allow to capture power-ups while attacking
          // because it's too easy.
          continue;
        }

        const hitBox = this.hero.getHitBox();
        const targetHitBox = coin.getHitBox();

        if (hitBox.collidesWith(targetHitBox)) {
          coin.tryCapture();
          this.game.score.addPoints(coin.scoreValue);
          this.game.score.addCoins(1);
        }
      }

      // Check for collisions between hero and power ups
      for (let powerUp of this.powerUps) {
        if (powerUp.disabled) {
          continue;
        }

        if (this.hero.isAttacking()) {
          // Don't allow to capture power-ups while attacking
          // because it's too easy.
          continue;
        }

        const hitBox = this.hero.getHitBox();
        const targetHitBox = powerUp.getHitBox();

        if (hitBox.collidesWith(targetHitBox)) {
          powerUp.tryCapture();
          this.game.score.addPoints(powerUp.scoreValue);
          this.hero.increaseLife(powerUp.lifeValue);
        }
      }
    }

    if (this.hero.gameOver) {
      // Game Over
      this.context.fillText(`Game Over.`, this.game.size.width * 0.45, this.game.size.height * 0.40);
    }
  }
}