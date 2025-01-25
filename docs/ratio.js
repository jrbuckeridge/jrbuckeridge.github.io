import {Size} from "./hitbox.js";

/**
 * @type {Size} The base size of the game.
 */
const BASE_SIZE = new Size(1180, 820, 1);

/**
 * The ratio of a size to the base size of the game.
 */
export class Ratio {
 constructor(size) {
   this.xScale = size.width / BASE_SIZE.width;
   this.yScale = size.height / BASE_SIZE.height;
 }
}
