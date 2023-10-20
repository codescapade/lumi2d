import { Game, Scene } from 'lilo2d';
import { Image } from 'love.graphics';

love.window.setMode(480, 800, { resizable: true });
love.window.setTitle('Game Loop');

class TestScene extends Scene {
  private background!: Image;

  override load(): void {
    this.background = love.graphics.newImage('assets/background.png');
    print('test scene loaded');
  }

  override draw(): void {
    love.graphics.draw(this.background);
  }
}

Game.showDebugInfo = true;
Game.start(320, 480, TestScene);
