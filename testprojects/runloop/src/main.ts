import { Events, Game, GamepadEvent, Scene, View, scaleModeNoScale } from 'lilo2d';
import { Image } from 'love.graphics';

love.window.setMode(480, 800, { resizable: true });
love.window.setTitle('Game Loop');

class TestScene extends Scene {
  private background!: Image;

  override load(): void {
    View.viewAnchorX = 0.5;
    View.viewAnchorY = 0.5;
    View.setScaleMode(scaleModeNoScale);
    this.background = love.graphics.newImage('assets/background.png');

    Events.on(GamepadEvent.CONNECTED, (event: GamepadEvent) => {
      print(`connected ${event.id}`);
    });

    Events.on(GamepadEvent.DISCONNECTED, (event: GamepadEvent) => {
      print(`connected ${event.id}`);
    });

    Events.on(GamepadEvent.AXIS_CHANGED, (event: GamepadEvent) => {
      print(`axis ${event.axis}, value ${event.value}`);
    });

    Events.on(GamepadEvent.BUTTON_PRESSED, (event: GamepadEvent) => {
      print(`button ${event.button} pressed`);
    });

    Events.on(GamepadEvent.BUTTON_RELEASED, (event: GamepadEvent) => {
      print(`button ${event.button} released`);
    });
  }

  override draw(): void {
    love.graphics.draw(this.background);
  }
}

Game.showDebugInfo = true;
Game.start(320, 480, TestScene);
