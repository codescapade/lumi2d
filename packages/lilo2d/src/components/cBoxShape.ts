import { Color } from '../graphics';
import { Point } from '../math';

/**
 * Component to draw basic 2d boxes.
 */
export class CBoxShape {
  /**
   * The width in pixels.
   */
  width: number;

  /**
   * The height in pixels.
   */
  height: number;

  /**
   * The fill color.
   */
  color: Color;

  /**
   * The anchor point.
   */
  anchor = new Point(0.5, 0.5);

  /**
   * Love transform reference so we can offset position, rotation and scale.
   */
  private transform = love.math.newTransform();

  /**
   * Create a new Box shape component.
   * @param options The initialization values.
   */
  constructor(options: CBoxShapeOptions) {
    this.width = options.width;
    this.height = options.height;
    this.color = options.color;
    this.anchor.x = options.anchorX ?? 0.5;
    this.anchor.y = options.anchorY ?? 0.5;
  }

  /**
   * Draw the box.
   * @param x The x position in pixels.
   * @param y The y position in pixels.
   * @param angle The angle in degrees.
   * @param scaleX The x axis scale.
   * @param scaleY The y axis scale.
   */
  draw(x: number, y: number, angle = 0, scaleX = 1.0, scaleY = 1.0): void {
    const [r, g, b, a] = this.color.parts();
    love.graphics.setColor(r, g, b, a);

    // Set the correct position using love transforms.
    this.transform.setTransformation(
      x,
      y,
      angle,
      scaleX,
      scaleY,
      this.width * this.anchor.x,
      this.height * this.anchor.y
    );
    love.graphics.push();
    love.graphics.applyTransform(this.transform);

    love.graphics.rectangle('fill', 0, 0, this.width, this.height);
    love.graphics.pop();
  }
}

/**
 * The box shape initialization values.
 */
export interface CBoxShapeOptions {
  /**
   * The width of the box in pixels.
   */
  width: number;

  /**
   * The height of the box in pixels.
   */
  height: number;

  /**
   * The box color.
   */
  color: Color;

  /**
   * The x axis anchor. (0.0 - 1.0).
   */
  anchorX?: number;

  /**
   * The y axis anchor. (0.0 - 1.0).
   */
  anchorY?: number;
}
