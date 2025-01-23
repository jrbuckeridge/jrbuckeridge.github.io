import {Size} from "./hitbox.js";
import {ParallaxBackground} from "./background.js";
import BatVillain from "./villain.js";
import {Coin, Health} from "./power-up.js";

class Level {
  constructor(game, levelDetails, hero, goals) {
    this.game = game;
    this.context = game.context;
    this.levelDetails = levelDetails;
    this.hero = hero;
    this.goals = goals;
    this.backgrounds = [];
    /**
     * The computed target goals when the level starts taking into account the initial player state.
     */
    this.targetGoal = goals;
    this.resize();
  }

  isLevelCompleted () {
    return this.targetGoal.isAchieved(this.game.score);
  }

  start(score) {
    this.targetGoal = this.goals.add(score);
  }

  resize() {
    this.context.font = "32px Bungee";
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

export class Level1 extends Level {
  constructor(game, levelDetails, hero, goals) {
    super(game, levelDetails, hero, goals);
    this.renderGoals = true;
    this.renderGoalsListener = () => {
      this.renderGoals = false;
      window.removeEventListener('keypress', this.renderGoalsListener);
    };
    window.addEventListener('keypress', this.renderGoalsListener);

    // Solid background
    this.backgrounds.push(new ParallaxBackground('img/background/nature-landscape/layer-1.png', 0,
      new Size(game.size.width, game.size.height)));
    // Clouds
    this.backgrounds.push(new ParallaxBackground('img/background/nature-landscape/layer-2.png', -0.05,
      new Size(game.size.width, game.size.height)));
    // Big mountains
    this.backgrounds.push(new ParallaxBackground('img/background/nature-landscape/layer-3.png', -0.10,
      new Size(game.size.width, game.size.height)));
    // Small mountains
    this.backgrounds.push(new ParallaxBackground('img/background/nature-landscape/layer-4.png', -0.15,
      new Size(game.size.width, game.size.height)));
    // Rocks
    this.backgrounds.push(new ParallaxBackground('img/background/nature-landscape/layer-5.png', -0.25,
      new Size(game.size.width, game.size.height)));
    // Bushes
    this.backgrounds.push(new ParallaxBackground('img/background/nature-landscape/layer-6.png', -0.25,
      new Size(game.size.width, game.size.height)));
    // Terrain
    this.backgrounds.push(new ParallaxBackground('img/background/nature-landscape/layer-7.png', -0.5,
      new Size(game.size.width, game.size.height)));

    const numVillains = 50;
    this.villains = [];
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
    this.coins = [];
    for (let i = 1; i <= numCoins; i++) {
      let coin = new Coin(this.game.size);
      coin.setPosition(
        this.game.size.width * 1.1 + (this.game.size.width * 0.25 * i) + (Math.random() - 0.5) * 50,
        this.game.size.height / 2 + (Math.random() - 0.5) * 200);
      this.coins.push(coin);
    }

    const numHealths = Math.floor(numVillains / 15);
    this.healths = [];
    for (let i = 1; i <= numHealths; i++) {
      let health = new Health(this.game.size);
      health.setPosition(
        this.villains[i * 15 - 1].x + (Math.random() - 0.5) * 50,
        this.game.size.height / 2);
      this.healths.push(health);
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
      villain.setPosition(this.game.size.width * 0.285, this.game.size.height * 0.49 - 36);
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
    // Draw health power-ups
    for (let health of this.healths) {
      health.draw(this.context, deltaTime);
    }

    // Draw hero
    this.hero.draw(this.context, deltaTime);
    // // Debug with hit boxes
    // const debugHitBox = hero.getHitBox();
    // context.strokeRect(debugHitBox.x, debugHitBox.y, debugHitBox.width, debugHitBox.height);
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
    // Draw health power-ups
    for (let health of this.healths) {
      health.update(deltaTime);
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

      // Check for collisions between hero and health power ups
      for (let health of this.healths) {
        if (health.disabled) {
          continue;
        }

        if (this.hero.isAttacking()) {
          // Don't allow to capture power-ups while attacking
          // because it's too easy.
          continue;
        }

        const hitBox = this.hero.getHitBox();
        const targetHitBox = health.getHitBox();

        if (hitBox.collidesWith(targetHitBox)) {
          health.tryCapture();
          this.game.score.addPoints(health.scoreValue);
          this.hero.increaseLife(health.lifeValue);
        }
      }
    }

    if (this.hero.gameOver) {
      // Game Over
      this.context.fillText(`Game Over.`, this.game.size.width * 0.45, this.game.size.height * 0.40);
    }
  }
}