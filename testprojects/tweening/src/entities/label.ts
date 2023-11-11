import { Color, Entity } from 'lilo2d';
import { Font } from 'love.graphics';

export class Label implements Entity {
  layer = 2;

  active = true;

  x: number;

  y: number;

  font: Font;

  text: string;

  private color = Color.WHITE;

  constructor(x: number, y: number, font: Font, text: string) {
    this.x = x;
    this.y = y;
    this.font = font;
    this.text = text;
  }

  draw(): void {
    const [r, g, b, a] = this.color.parts();
    love.graphics.setColor(r, g, b, a);

    love.graphics.setFont(this.font);
    love.graphics.print(this.text, this.x, this.y - this.font.getHeight() * 0.5);
  }
}
