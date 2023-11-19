import { Assets, Events, Game, KeyboardEvent, MouseEvent, Scene, Scenes, View } from '@lumi2d/lumi';
import { Image } from 'love.graphics';
import { Bunny } from '../entities/bunny';
import { Label } from '../entities/label';

/**
 * This is the main scene.
 */
export class GameScene extends Scene {
  /**
   * The image to draw the bunny with.
   */
  private bunnyImage!: Image;

  /**
   * The vertical gravity in pixels per second.
   */
  private readonly gravity = 550;

  /**
   * Check if the mouse button is down.
   */
  private buttonDown = false;

  /**
   * The number of bunnies on the screen.
   */
  private count = 0;

  /**
   * The label for the bunny count.
   */
  private bunnyCountLabel!: Label;

  /**
   * The label for the key info.
   */
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

    // Create one bunny to start with.
    this.createBunny();

    // Setup the mouse events.
    Events.on(MouseEvent.BUTTON_PRESSED, () => {
      this.buttonDown = true;
    });

    Events.on(MouseEvent.BUTTON_RELEASED, () => {
      this.buttonDown = false;
    });

    // Key press events.
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

    // Create bunnies when the mouse button is down.
    if (this.buttonDown) {
      for (const _ of $range(1, 20)) {
        this.createBunny();
      }
    }
  }

  /**
   * Create a new bunny.
   */
  private createBunny(): void {
    const [viewWidth, viewHeight] = View.getViewSize();
    const bunny = new Bunny(this.bunnyImage, this.gravity, viewWidth, viewHeight);
    this.addEntity(bunny);
    this.count++;
    this.bunnyCountLabel.text = `Bunnies: ${this.count}`;
  }
}
