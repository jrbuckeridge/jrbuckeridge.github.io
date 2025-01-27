/**
 * Represents the level objectives the player needs to complete.
 */
export class Goal {
  /**
   * @param coins The number of coins a player must collect.
   * @param defeatedVillains The number of villains that must be defeated.
   * @param timeInMillis The amount of time, in milliseconds, to complete a level.
   */
  constructor(coins, defeatedVillains, timeInMillis) {
    this.coins = coins;
    this.defeatedVillains = defeatedVillains;
    this.timeInMillis = timeInMillis;
  }

  /**
   * Returns a new copy of {Goal} with the added values.
   * @param score The {Score} to add.
   * @returns {Goal}
   */
  add(score) {
    return new Goal(this.coins + score.coins,
      this.defeatedVillains + score.defeatedVillains,
      this.timeInMillis);
  }

  /**
   * Determines if the goals are achieved.
   * @param score {Score} The score to compare to.
   * @returns {boolean} True if the goals have been achieved.
   */
  isAchieved(score) {
    if (this.coins && score.coins < this.coins) return false;
    if (this.defeatedVillains && score.defeatedVillains < this.defeatedVillains) return false;

    return true;
  }
}