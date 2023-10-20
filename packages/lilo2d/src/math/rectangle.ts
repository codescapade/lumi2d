/**
 * Rectangle class.
 */
export class Rectangle {
  /**
   * The x axis position of the rectangle.
   */
  x: number;

  /**
   * The y axis position of the rectangle.
   */
  y: number;

  /**
   * The width of the rectangle.
   */
  width: number;

  /**
   * The height of the rectangle.
   */
  height: number;

  /**
   * Create a new Rectangle.
   * @param x
   * @param y
   * @param width
   * @param height
   */
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Check if a point is inside a rectangle.
   * @param x The x position to check.
   * @param y The y position to check.
   * @returns True if the point is inside the rectangle.
   */
  hasPoint(x: number, y: number): boolean {
    return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
  }
}
