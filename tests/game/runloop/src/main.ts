import { Game, Scene } from 'lilo2d';

class TestScene extends Scene {
  override load(): void {
    print('test scene loaded');
  }
}

Game.showDebugInfo = true;
Game.start(800, 600, TestScene);
