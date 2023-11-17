import { LumiMath } from './lumiMath';
import { Point } from './point';

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

  /**
   * Check if two rectangles intersect.
   * @param rect The rectangle to check with.
   * @returns True if the rectangles intersect.
   */
  intersects(rect: Rectangle): boolean {
    return (
      this.x < rect.x + rect.width &&
      this.x + this.width > rect.x &&
      this.y < rect.y + rect.height &&
      this.y + this.height > rect.y
    );
  }

  /**
   * Check if a line intersects with this rectangle.
   * @param startX The x position of the line start.
   * @param startY The y position of the line start.
   * @param endX The x position of the line end.
   * @param endY The y position of the line end.
   * @param out The intersect point.
   * @returns True if the line intersects.
   */
  intersectsLine(startX: number, startY: number, endX: number, endY: number, out?: Point): boolean {
    let intersects = false;

    // Check top.
    if (LumiMath.linesIntersect(startX, startY, endX, endY, this.x, this.y, this.x + this.width, this.y, out)) {
      intersects = true;
    }

    // Check right
    if (
      LumiMath.linesIntersect(
        startX,
        startY,
        endX,
        endY,
        this.x + this.width,
        this.y + this.height,
        this.x + this.width,
        this.y,
        out
      )
    ) {
      intersects = true;
    }

    // Check bottom.
    if (
      LumiMath.linesIntersect(
        startX,
        startY,
        endX,
        endY,
        this.x + this.width,
        this.y + this.height,
        this.x,
        this.y + this.height,
        out
      )
    ) {
      intersects = true;
    }

    // Check left.
    if (LumiMath.linesIntersect(startX, startY, endX, endY, this.x, this.y, this.x, this.y + this.height, out)) {
      intersects = true;
    }

    return intersects;
  }

  /**
   * Update the rectangle values.
   * @param x The new x position.
   * @param y The new y position.
   * @param width The new width.
   * @param height The new height.
   */
  set(x: number, y: number, width: number, height: number): void {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
