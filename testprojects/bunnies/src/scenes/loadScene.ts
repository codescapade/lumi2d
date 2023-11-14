import { Assets, Scene, Scenes } from '@lilo2d/lilo';
import { GameScene } from './gameScene';

/**
 * This scene runs on game start and loads the assets.
 */
export class LoadScene extends Scene {
  override load(): void {
    Assets.loadImage('bunny', 'assets/bunny.png');
    Assets.loadFont('labelFont', 16);

    // After the loading we start the game scene.
    Scenes.replace(GameScene);
  }
}
