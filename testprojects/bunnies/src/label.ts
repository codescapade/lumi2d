import { Color, Entity, Point } from 'lilo2d';
import { Font } from 'love.graphics';

export class Label implements Entity {
  layer = 2;
  active = true;

  text: string;

  position: Point;

  anchor: Point;

  font: Font;

  constructor(x: number, y: number, font: Font, text: string, anchorX = 0, anchorY = 0) {
    this.position = new Point(x, y);
    this.font = font;
    this.text = text;
    this.anchor = new Point(anchorX, anchorY);
  }

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
