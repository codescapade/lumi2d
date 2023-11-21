import { Assets, Scene, Scenes } from '@lumi2d/lumi';
import { GameScene } from './gameScene';

export class LoadScene extends Scene {
  override load(): void {
    Assets.loadAtlas('sprites', 'assets/sprites.png', 'assets/sprites.json');

    Scenes.replace(GameScene);
  }
}
