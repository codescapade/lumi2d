import { Color, Ease, Entity, Point, Tween, Tweens, TweenSequence } from 'lilo2d';

export class TweenGraphic implements Entity {
  layer = 1;
  active = true;

  x: number;

  y: number;

  private radius = 10;

  private color: Color;

  constructor(start: Point, end: Point, ease: Ease, duration: number, color: Color) {
    this.x = start.x;
    this.y = start.y;
    this.color = color;

    const tweenStart = new Tween(this, duration, { x: start.x, y: start.y }, { x: end.x, y: end.y }).setEase(ease);
    const tweenPauseEnd = new Tween(this, 0.5, { x: end.x, y: end.y }, { x: end.x, y: end.y });
    const tweenReturn = new Tween(this, duration, { x: end.x, y: end.y }, { x: start.x, y: start.y }).setEase(ease);
    const tweenPauseStart = new Tween(this, 0.5, { x: start.x, y: start.y }, { x: start.x, y: start.y });
    const sequence = new TweenSequence([tweenStart, tweenPauseEnd, tweenReturn, tweenPauseStart], -1);

    Tweens.addSequence(sequence);
  }

  draw(): void {
    const [r, g, b, a] = this.color.parts();
    love.graphics.setColor(r, g, b, a);
    love.graphics.circle('fill', this.x, this.y, this.radius, 32);
  }
}
