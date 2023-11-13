import { Font } from 'love.graphics';
import { Color } from '../graphics';
import { Point } from '../math';

/**
 * Simple text component.
 */
export class CText {
  anchor = new Point(0.5, 0.5);

  /**
   * The font to draw with.
   */
  font: Font;

  /**
   * The text to display.
   */
  text: string;

  /**
   * The text color.
   */
  color: Color;

  /**
   * Create a new CText instance.
   * @param font The font to use.
   * @param text The text to display.
   * @param color The text color.
   */
  constructor(font: Font, text: string, color: Color) {
    this.font = font;
    this.text = text;
    this.color = color;
  }

  /**
   * Draw the text.
   * @param x The x position in pixels.
   * @param y The y position in pixels.
   * @param angle The angle in degrees.
   * @param scaleX The x axis scale.
   * @param scaleY The y axis scale.
   */
  draw(x: number, y: number, angle: number, scaleX: number, scaleY: number): void {
    const [r, g, b, a] = this.color.parts();
    love.graphics.setFont(this.font);
    love.graphics.setColor(r, g, b, a);
    love.graphics.print(
      this.text,
      x - this.font.getWidth(this.text) * this.anchor.x,
      y - this.font.getHeight() * this.anchor.y,
      math.rad(angle),
      scaleX,
      scaleY
    );
  }
}
