import { Assets, Events, Game, KeyboardEvent, MouseEvent, Scene, Scenes, View } from 'lilo2d';
import { Image } from 'love.graphics';
import { Bunny } from './bunny';
import { Label } from './label';

class LoadScene extends Scene {
  override load(): void {
    Assets.loadImage('bunny', 'assets/bunny.png');
    Assets.loadFont('labelFont', 16);

    Scenes.replace(GameScene);
  }
}

class GameScene extends Scene {
  private bunnyImage!: Image;

  private readonly gravity = 550;

  private buttonDown = false;

  private count = 0;

  private bunnyCountLabel!: Label;

  private infoLabel!: Label;

  override load(): void {
    this.bunnyImage = Assets.getImage('bunny');

    const font = Assets.getFont('labelFont');

    this.bunnyCountLabel = new Label(10, 10, font, 'Bunnies: 0');
    this.addEntity(this.bunnyCountLabel);

    const [viewX] = View.getViewSize();
    this.infoLabel = new Label(
      viewX - 10,
      10,
      font,
      'R to restart. L to swap label layer. S to toggle debug info.',
      1,
      0
    );
    this.addEntity(this.infoLabel);

    this.createBunny();

    Events.on(MouseEvent.BUTTON_PRESSED, () => {
      this.buttonDown = true;
    });

    Events.on(MouseEvent.BUTTON_RELEASED, () => {
      this.buttonDown = false;
    });

    Events.on(KeyboardEvent.PRESSED, (event: KeyboardEvent) => {
      if (event.key === 'r') {
        Scenes.replace(GameScene);
      } else if (event.key === 'l') {
        this.bunnyCountLabel.layer = this.bunnyCountLabel.layer === 2 ? 0 : 2;
        this.infoLabel.layer = this.infoLabel.layer === 2 ? 0 : 2;
      } else if (event.key === 's') {
        Game.showDebugInfo = !Game.showDebugInfo;
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

Game.start(800, 600, LoadScene);
Game.showDebugInfo = true;
