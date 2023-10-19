import { Canvas } from 'love.graphics';
import { View } from './view';
import { TimeStep } from './utils';
import { Scene, Scenes } from './scenes';

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

    // Debug information on top of the game.
    if (Game.showDebugInfo) {
      const stats = love.graphics.getStats();
      const fps = TimeStep.fps;
      const [_, viewHeight] = View.getViewSize();

      love.graphics.setFont(Game.debugFont);
      love.graphics.setColor(1, 1, 1, 1);
      love.graphics.print(`draw calls ${stats.drawcalls}`, 20, viewHeight - 40);

      const memory = string.format('texture mem: %.2f MB', stats.texturememory / 1024 / 1024);
      love.graphics.print(memory, 20, viewHeight - 60);
      love.graphics.print(`FPS: ${fps}`, 20, viewHeight - 80);
    }

    // Stop drawing to the canvas.
    love.graphics.setCanvas();
    love.graphics.clear();
    love.graphics.setColor(1, 1, 1, 1);

    // Scale the main canvas up
    const scale = View.getViewScaleFactor();
    love.graphics.draw(Game.canvas, 0, 0, 0, scale, scale);
    love.graphics.present();
  }
}

// Overriding the default love.run so it works with our engine.
// We can custom drawing.
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
