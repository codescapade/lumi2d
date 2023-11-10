import {
  Assets,
  Ease,
  Point,
  Scene,
  easeInBack,
  easeInBounce,
  easeInCircular,
  easeInCubic,
  easeInElastic,
  easeInExpo,
  easeInOutBack,
  easeInOutBounce,
  easeInOutCircular,
  easeInOutCubic,
  easeInOutElastic,
  easeInOutExpo,
  easeInOutQuad,
  easeInOutQuart,
  easeInOutQuint,
  easeInOutSine,
  easeInQuad,
  easeInQuart,
  easeInQuint,
  easeInSine,
  easeLinear,
  easeOutBack,
  easeOutBounce,
  easeOutCircular,
  easeOutCubic,
  easeOutElastic,
  easeOutExpo,
  easeOutQuad,
  easeOutQuart,
  easeOutQuint,
  easeOutSine,
} from 'lilo2d';
import { TweenBox } from '../entities/tweenBox';
import { Font } from 'love.graphics';
import { Label } from '../entities/label';
import { Line } from '../entities/line';

export class MainScene extends Scene {
  private font!: Font;

  override load(): void {
    this.font = Assets.loadFont('f12', 16);

    const inLabel = new Label(190, 20, this.font, 'in');
    this.addEntity(inLabel);

    const outLabel = new Label(430, 20, this.font, 'out');
    this.addEntity(outLabel);

    const inOutLabel = new Label(650, 20, this.font, 'in out');
    this.addEntity(inOutLabel);

    this.addTweenBox(easeLinear, 130, 50, 'linear');
    this.addTweenBox(easeLinear, 370, 50);
    this.addTweenBox(easeLinear, 610, 50);

    this.addTweenBox(easeInSine, 130, 100, 'sine');
    this.addTweenBox(easeOutSine, 370, 100);
    this.addTweenBox(easeInOutSine, 610, 100);

    this.addTweenBox(easeInQuint, 130, 150, 'quint');
    this.addTweenBox(easeOutQuint, 370, 150);
    this.addTweenBox(easeInOutQuint, 610, 150);

    this.addTweenBox(easeInQuart, 130, 200, 'quart');
    this.addTweenBox(easeOutQuart, 370, 200);
    this.addTweenBox(easeInOutQuart, 610, 200);

    this.addTweenBox(easeInQuad, 130, 250, 'quad');
    this.addTweenBox(easeOutQuad, 370, 250);
    this.addTweenBox(easeInOutQuad, 610, 250);

    this.addTweenBox(easeInExpo, 130, 300, 'expo');
    this.addTweenBox(easeOutExpo, 370, 300);
    this.addTweenBox(easeInOutExpo, 610, 300);

    this.addTweenBox(easeInElastic, 130, 350, 'elastic');
    this.addTweenBox(easeOutElastic, 370, 350);
    this.addTweenBox(easeInOutElastic, 610, 350);

    this.addTweenBox(easeInCircular, 130, 400, 'circular');
    this.addTweenBox(easeOutCircular, 370, 400);
    this.addTweenBox(easeInOutCircular, 610, 400);

    this.addTweenBox(easeInBack, 130, 450, 'back');
    this.addTweenBox(easeOutBack, 370, 450);
    this.addTweenBox(easeInOutBack, 610, 450);

    this.addTweenBox(easeInBounce, 130, 500, 'bounce');
    this.addTweenBox(easeOutBounce, 370, 500);
    this.addTweenBox(easeInOutBounce, 610, 500);

    this.addTweenBox(easeInCubic, 130, 550, 'cubic');
    this.addTweenBox(easeOutCubic, 370, 550);
    this.addTweenBox(easeInOutCubic, 610, 550);
  }

  private addTweenBox(ease: Ease, x: number, y: number, name?: string): void {
    if (name) {
      const label = new Label(20, y, this.font, name);
      this.addEntity(label);
    }

    const line = new Line(new Point(x, y), new Point(x + 140, y));
    this.addEntity(line);

    const box = new TweenBox(new Point(x, y), new Point(x + 140, y), ease, 4);
    this.addEntity(box);
  }
}
