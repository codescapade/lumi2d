import { Color, Ease, Entity, Point, Tween, Tweens, TweenSequence } from 'lilo2d';

export class TweenBox implements Entity {
  layer = 1;
  active = true;

  x: number;

  y: number;

  private size = 20;

  private color = Color.fromBytes(100, 180, 220);

  constructor(start: Point, end: Point, ease: Ease, duration: number) {
    this.x = start.x;
    this.y = start.y;

    const tweenStart = new Tween(this, duration, { x: start.x, y: start.y }, { x: end.x, y: end.y }).setEase(ease);
    const tweenReturn = new Tween(this, duration, { x: end.x, y: end.y }, { x: start.x, y: start.y }).setEase(ease);
    const sequence = new TweenSequence(-1, tweenStart, tweenReturn);

    Tweens.addSequence(sequence);
  }

  draw(): void {
    const [r, g, b, a] = this.color.parts();
    love.graphics.setColor(r, g, b, a);
    love.graphics.rectangle('fill', this.x - this.size * 0.5, this.y - this.size * 0.5, this.size, this.size);
  }
}
