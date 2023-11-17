import { Color, Entity, Point } from '@lumi2d/lumi';

export class Line implements Entity {
  layer = 0;

  active = true;

  start: Point;

  end: Point;

  constructor(start: Point, end: Point) {
    this.start = start;
    this.end = end;
  }

  draw(): void {
    const [r, g, b, a] = Color.WHITE.parts();

    love.graphics.setColor(r, g, b, a);
    love.graphics.line(this.start.x, this.start.y, this.end.x, this.end.y);
  }
}
