import { Events, Game, KeyboardEvent, MouseEvent, Scene, Scenes, View } from 'lilo2d';
import { Image } from 'love.graphics';
import { Bunny } from './bunny';
import { Label } from './label';

class TestScene extends Scene {
  private bunnyImage!: Image;

  private readonly gravity = 550;

  private buttonDown = false;

  private count = 0;

  private bunnyCountLabel!: Label;

  override load(): void {
    this.bunnyImage = love.graphics.newImage('assets/bunny.png');

    const font = love.graphics.newFont(16);
    this.bunnyCountLabel = new Label(10, 10, font, 'Bunnies: 0');
    this.addEntity(this.bunnyCountLabel);

    this.createBunny();

    Events.on(MouseEvent.BUTTON_PRESSED, () => {
      this.buttonDown = true;
    });

    Events.on(MouseEvent.BUTTON_RELEASED, () => {
      this.buttonDown = false;
    });

    Events.on(KeyboardEvent.PRESSED, (event: KeyboardEvent) => {
      if (event.key == 'r') {
        Scenes.replace(TestScene);
      }
    });
  }

  override update(dt: number): void {
    super.update(dt);

    if (this.buttonDown) {
      for (const _ of $range(1, 20)) {
        this.createBunny();
      }
    }
  }

  private createBunny(): void {
    const [viewWidth, viewHeight] = View.getViewSize();
    const bunny = new Bunny(this.bunnyImage, this.gravity, viewWidth, viewHeight);
    this.addEntity(bunny);
    this.count++;
    this.bunnyCountLabel.text = `Bunnies: ${this.count}`;
  }
}

Game.start(800, 600, TestScene);
Game.showDebugInfo = true;
