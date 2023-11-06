import { Color, Entity, Point } from 'lilo2d';
import { Font } from 'love.graphics';

/**
 * Label entity to draw text on the screen.
 */
export class Label implements Entity {
  /**
   * By default we draw these on top of the bunnies on layer 1.
   */
  layer = 2;

  /**
   * The label should start active.
   */
  active = true;

  /**
   * The text to draw.
   */
  text: string;

  /**
   * The text position in pixels.
   */
  position: Point;

  /**
   * The anchor so we can align the text.
   */
  anchor: Point;

  /**
   * The font to use
   */
  font: Font;

  /**
   * Create a new label instance.
   * @param x
   * @param y
   * @param font
   * @param text
   * @param anchorX
   * @param anchorY
   */
  constructor(x: number, y: number, font: Font, text: string, anchorX = 0, anchorY = 0) {
    this.position = new Point(x, y);
    this.font = font;
    this.text = text;
    this.anchor = new Point(anchorX, anchorY);
  }

  /**
   * Draw the label on the screen.
   */
  draw(): void {
    const [r, g, b, a] = Color.WHITE.parts();
    love.graphics.setColor(r, g, b, a);

    love.graphics.setFont(this.font);
    love.graphics.print(
      this.text,
      this.position.x,
      this.position.y,
      0,
      1,
      1,
      this.font.getWidth(this.text) * this.anchor.x,
      this.font.getHeight() * this.anchor.y
    );
  }
}
