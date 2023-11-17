import {
  Assets,
  Color,
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
} from '@lumi2d/lumi';
import { TweenGraphic } from '../entities/tweenGraphic';
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

    let color = Color.fromBytes(50, 100, 150);
    this.addTweenBox([easeLinear, easeLinear, easeLinear], 50, color, 'linear');

    color = Color.fromBytes(60, 110, 160);
    this.addTweenBox([easeInSine, easeOutSine, easeInOutSine], 100, color, 'sine');

    color = Color.fromBytes(70, 120, 170);
    this.addTweenBox([easeInQuad, easeOutQuad, easeInOutQuad], 150, color, 'quad');

    color = Color.fromBytes(80, 130, 180);
    this.addTweenBox([easeInCubic, easeOutCubic, easeInOutCubic], 200, color, 'cubic');

    color = Color.fromBytes(90, 140, 190);
    this.addTweenBox([easeInCircular, easeOutCircular, easeInOutCircular], 250, color, 'circular');

    color = Color.fromBytes(100, 150, 200);
    this.addTweenBox([easeInQuart, easeOutQuart, easeInOutQuart], 300, color, 'quart');

    color = Color.fromBytes(110, 160, 210);
    this.addTweenBox([easeInQuint, easeOutQuint, easeInOutQuint], 350, color, 'quint');

    color = Color.fromBytes(120, 170, 220);
    this.addTweenBox([easeInExpo, easeOutExpo, easeInOutExpo], 400, color, 'expo');

    color = Color.fromBytes(130, 180, 230);
    this.addTweenBox([easeInElastic, easeOutElastic, easeInOutElastic], 450, color, 'elastic');

    color = Color.fromBytes(140, 190, 240);
    this.addTweenBox([easeInBack, easeOutBack, easeInOutBack], 500, color, 'back');

    color = Color.fromBytes(150, 200, 250);
    this.addTweenBox([easeInBounce, easeOutBounce, easeInOutBounce], 550, color, 'bounce');
  }

  private addTweenBox(easing: Ease[], y: number, color: Color, name: string): void {
    const label = new Label(20, y, this.font, name);
    this.addEntity(label);

    // The x positions of the start of the tween. there are 3 per row.
    const xStarts = [130, 370, 610];
    for (let i = 0; i < easing.length; i++) {
      const x = xStarts[i];

      const line = new Line(new Point(x, y), new Point(x + 140, y));
      this.addEntity(line);

      const box = new TweenGraphic(new Point(x, y), new Point(x + 140, y), easing[i], 4, color);
      this.addEntity(box);
    }
  }
}
