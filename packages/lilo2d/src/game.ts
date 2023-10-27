import { LightUserData } from 'love';
import { Canvas } from 'love.graphics';
import { GamepadAxis, GamepadButton, Joystick, JoystickHat } from 'love.joystick';
import { KeyConstant, Scancode } from 'love.keyboard';
import { KeyboardEvent } from './events';
import { GamepadEvent } from './events/input/gamepadEvent';
import { JoystickEvent } from './events/input/joystickEvent';
import { MouseEvent } from './events/input/mouseEvent';
import { TouchEvent } from './events/input/touchEvent';
import { Scene, Scenes } from './scenes';
import { TimeStep } from './utils';
import { View } from './view';

// Define the global love arg which are the arguments passed in when starting love.
declare const arg: string[];

// Custom type helper for the love event loop.
type HandlerKey = keyof typeof love.handlers;

// This is the maximum value delta time can have. Minimized and out of focus windows will not update
// and will make the delta time too high when coming back to the foreground. So we clamp it.
const MAX_DT = 1.0 / 30;

/**
 * The Game class is the main class that starts the engine.
 * @noSelf
 */
export class Game {
  /**
   * If true it shows the frame rate, texture memory and draw calls on the screen.
   */
  static showDebugInfo = false;

  /**
   * The main canvas. This will be scaled to fit the window.
   */
  static canvas: Canvas;

  /**
   * Track if the game has been started. So we don't update or render the game before that.
   */
  static started = false;

  /**
   * The font used for the debug info.
   */
  private static debugFont = love.graphics.newFont(16);

  /**
   * This is the starting point of the engine. This starts the game.
   * @param designWidth The width the game is designed for in pixels.
   * @param designHeight The height the game is designed for in pixels.
   */
  static start(designWidth: number, designHeight: number, startScene: new () => Scene): void {
    View.init(designWidth, designHeight);
    const [viewWidth, viewHeight] = View.getViewSize();
    Game.canvas = love.graphics.newCanvas(viewWidth, viewHeight);
    Scenes.push(startScene);

    Game.started = true;
  }

  /**
   * Called every frame. Updates the current scene.
   * @param dt The time passed since the last update.
   */
  static update(dt: number): void {
    TimeStep.update(dt);
    const scene = Scenes.current();
    scene.update(dt);
    scene.lateUpdate(dt);
  }

  /**
   * Called every frame after update. Draws the scene.
   */
  static draw(): void {
    love.graphics.setCanvas(Game.canvas);
    love.graphics.clear();

    const scene = Scenes.current();

    // If the current scene is an overlay scene, draw the scene below it first.
    if (scene.isOverlay) {
      if (Scenes.sceneStack.length > 1) {
        Scenes.sceneStack[Scenes.sceneStack.length - 2].draw();
      }
    }
    scene.draw();

    const [offsetX, offsetY] = View.getViewOffset();

    // Stop drawing to the canvas.
    love.graphics.setCanvas();
    love.graphics.clear();
    love.graphics.setColor(1, 1, 1, 1);

    // Scale the main canvas up
    const [scaleX, scaleY] = View.getViewScaleFactor();
    love.graphics.draw(Game.canvas, offsetX, offsetY, 0, scaleX, scaleY);

    // Debug information on top of the game.
    if (Game.showDebugInfo) {
      const stats = love.graphics.getStats();
      const fps = TimeStep.fps;
      const [_windowWidth, windowHeight] = View.getWindowSize();

      love.graphics.setFont(Game.debugFont);
      love.graphics.setColor(1, 1, 1, 1);
      love.graphics.print(`draw calls ${stats.drawcalls}`, 20, windowHeight - 40);

      const memory = string.format('texture mem: %.2f MB', stats.texturememory / 1024 / 1024);
      love.graphics.print(memory, 20, windowHeight - 60);
      love.graphics.print(`FPS: ${fps}`, 20, windowHeight - 80);
    }

    love.graphics.present();
  }
}

// Overriding the default love.run so it works with the engine.
// touchEvent use custom drawing.
love.run = (): (() => number | null) => {
  if (love.load) {
    love.load(love.arg.parseGameArguments(arg), arg);
  }

  if (love.timer !== undefined) {
    love.timer.step();
  }

  let dt = 0;

  // The game loop
  return (): number | null => {
    if (love.event !== undefined) {
      love.event.pump();

      // Get all events and handle them.
      for (const [name, a, b, c, d, e, f] of love.event.poll()) {
        // Quit the game.
        if (name == 'quit') {
          if (!love.quit || !love.quit()) {
            return (a as number) ?? 0;
          }
        }

        const handler = love.handlers[name as HandlerKey];
        if (handler) {
          handler(a as never, b as never, c as never, d as never, e as never, f as number);
        }
      }
    }

    // Update and clamp the delta time.
    if (love.timer !== undefined) {
      dt = love.timer.step();
      if (dt > MAX_DT) {
        dt = MAX_DT;
      }
    }

    if (Game.started) {
      Game.update(dt);
      Game.draw();
    }

    // Adding a small sleep time here makes sure the game doesn't run too fast when nothing is rendering.
    // Otherwise it wil load the cpu 100% when minimized.
    if (love.timer !== undefined) {
      love.timer.sleep(0.001);
    }

    // Returning null will continue the game.
    return null;
  };
};

// Window resize handler.
love.handlers.resize = (width: number, height: number): void => {
  View.scaleToWindow();
  const [viewWidth, viewHeight] = View.getViewSize();
  Game.canvas = love.graphics.newCanvas(viewWidth, viewHeight);
  Scenes.current().resize(width, height);
};

// Input handlers.

love.keypressed = (key: KeyConstant, scancode: Scancode, isrepeat: boolean): void => {
  KeyboardEvent.get(KeyboardEvent.PRESSED, key, scancode, isrepeat).send();
};

love.keyreleased = (key: KeyConstant, scancode: Scancode): void => {
  KeyboardEvent.get(KeyboardEvent.RELEASED, key, scancode).send();
};

love.mousepressed = (x: number, y: number, button: number, isTouch: boolean): void => {
  MouseEvent.get(MouseEvent.BUTTON_PRESSED, x, y, button, isTouch).send();
};

love.mousereleased = (x: number, y: number, button: number, isTouch: boolean): void => {
  MouseEvent.get(MouseEvent.BUTTON_RELEASED, x, y, button, isTouch).send();
};

love.mousemoved = (x: number, y: number, dx: number, dy: number, isTouch: boolean): void => {
  MouseEvent.get(MouseEvent.MOVED, x, y, undefined, isTouch, dx, dy).send();
};

love.wheelmoved = (x: number, y: number): void => {
  MouseEvent.get(MouseEvent.WHEEL, 0, 0, undefined, undefined, undefined, undefined, x, y).send();
};

love.touchpressed = (
  id: LightUserData<'Touch'>,
  x: number,
  y: number,
  dx: number,
  dy: number,
  pressure: number
): void => {
  TouchEvent.get(TouchEvent.PRESSED, id, x, y, dx, dy, pressure).send();
};

love.touchreleased = (
  id: LightUserData<'Touch'>,
  x: number,
  y: number,
  dx: number,
  dy: number,
  pressure: number
): void => {
  TouchEvent.get(TouchEvent.RELEASED, id, x, y, dx, dy, pressure).send();
};

love.touchmoved = (
  id: LightUserData<'Touch'>,
  x: number,
  y: number,
  dx: number,
  dy: number,
  pressure: number
): void => {
  TouchEvent.get(TouchEvent.MOVED, id, x, y, dx, dy, pressure).send();
};

love.joystickadded = (joystick: Joystick): void => {
  JoystickEvent.get(JoystickEvent.CONNECTED, joystick).send();
  GamepadEvent.get(GamepadEvent.CONNECTED, joystick).send();
};

love.joystickremoved = (joystick: Joystick): void => {
  JoystickEvent.get(JoystickEvent.DISCONNECTED, joystick).send();
  GamepadEvent.get(GamepadEvent.DISCONNECTED, joystick).send();
};

love.joystickaxis = (joystick: Joystick, axis: number, value: number): void => {
  JoystickEvent.get(JoystickEvent.AXIS_CHANGED, joystick, axis, value).send();
};

love.joystickhat = (joystick: Joystick, hat: number, direction: JoystickHat): void => {
  JoystickEvent.get(JoystickEvent.HAT_CHANGED, joystick, undefined, undefined, undefined, hat, direction).send();
};

love.joystickpressed = (joystick: Joystick, button: number): void => {
  JoystickEvent.get(JoystickEvent.BUTTON_PRESSED, joystick, undefined, undefined, button).send();
};

love.joystickreleased = (joystick: Joystick, button: number): void => {
  JoystickEvent.get(JoystickEvent.BUTTON_RELEASED, joystick, undefined, undefined, button).send();
};

love.gamepadaxis = (joystick: Joystick, axis: GamepadAxis, value: number): void => {
  GamepadEvent.get(GamepadEvent.AXIS_CHANGED, joystick, axis, value).send();
};

love.gamepadpressed = (joystick: Joystick, button: GamepadButton): void => {
  GamepadEvent.get(GamepadEvent.BUTTON_PRESSED, joystick, undefined, undefined, button).send();
};

love.gamepadreleased = (joystick: Joystick, button: GamepadButton): void => {
  GamepadEvent.get(GamepadEvent.BUTTON_RELEASED, joystick, undefined, undefined, button).send();
};
