/**
 * The score representation of the player in the game across all levels.
 */
export class Score {
  constructor() {
    /**
     *  @type {number} The points a player accumulates.
     */
    this.points = 0;
    /**
     * @type {number} The coins a player accumulates.
     */
    this.coins = 0;
    /**
     * @type {number} The number of villains a player has defeated.
     */
    this.defeatedVillains = 0;
  }

  /**
   * Adds points to the player score.
   *
   * @param points The points to add. Can be positive or negative.
   */
  addPoints(points) {
    this.points += points;
    if (this.points < 0) {
      this.points = 0;
    }
  }


  /**
   * Adds coins to the player score.
   *
   * @param coins The points to add. Can be positive or negative.
   */
  addCoins(coins) {
    this.coins += coins;
    if (this.coins < 0) {
      this.coins = 0;
    }
  }

  /**
   * Increases the count of defeated villains and increases the points.
   *
   * @param villain The villain that was defeated.
   */
  defeatedVillain(villain) {
    this.points += villain.scoreValue;
    this.defeatedVillains ++;
  }
}