/**
 * The scene manager class.
 * @noSelf
 */
export class Scenes {
  /**
   * All scenes in the stack. The top one is the active scene.
   */
  static sceneStack: Scene[] = [];

  /**
   * Get the current active scene.
   * @returns The current active scene.
   */
  static current(): Scene {
    return Scenes.sceneStack[Scenes.sceneStack.length - 1];
  }

  /**
   * Push a new scene onto the stack.
   * @param sceneClass The new scene class.
   */
  static push(sceneClass: new () => Scene): void {
    Scenes.createScene(sceneClass);
  }

  /**
   * Pop the top most scene off the stack and destroy it.
   */
  static pop(): void {
    if (Scenes.sceneStack.length > 1) {
      const scene = Scenes.sceneStack.pop()!;
      scene.destroy();
    }
  }

  /**
   * Replace a scene with a new one.
   * @param sceneClass The new class to add.
   * @param replaceAll Destroy all scenes that are on the stack currently.
   * @param below if true replace the scene below the current active scene. Useful for transition scenes.
   */
  static replace(sceneClass: new () => Scene, replaceAll = false, below = false): void {
    if (replaceAll) {
      while (Scenes.sceneStack.length > 0) {
        Scenes.sceneStack.pop()!.destroy();
      }
    } else if (!below) {
      Scenes.sceneStack.pop()!.destroy();
    }

    Scenes.createScene(sceneClass, below);
  }

  /**
   *
   * @param sceneClass The scene class to create.
   * @param below If true replace the scene below the current active scene.
   */
  private static createScene(sceneClass: new () => Scene, below = false): void {
    const scene = new sceneClass();
    if (below) {
      // If there is only one scene put the new scene at the bottom of the stack.
      if (Scenes.sceneStack.length <= 1) {
        Scenes.sceneStack.unshift(scene);
      } else {
        Scenes.sceneStack[Scenes.sceneStack.length - 2].destroy();
        Scenes.sceneStack[Scenes.sceneStack.length - 2] = scene;
      }
    } else {
      Scenes.sceneStack.push(scene);
    }

    scene.load();
  }
}

/**
 * Base scene class. Extend this class to create different scenes like a menu or game scene for example.
 */
export class Scene {
  /**
   * An overlay scene will render the scene below it.
   */
  isOverlay = false;

  /**
   * Load gets called after creating the scene. This can be used to create entities, load tilemaps, etc.
   */
  load(): void {}

  /**
   * Update gets called every frame. If you override it and don't call super.update() entities will not be updated.
   * @param dt The time passed since the last update in seconds.
   */
  update(dt: number): void {}

  /**
   * Late update gets called after update. Sometimes it is useful to update entities again after the first update.
   * For example if there is a physics update in between.
   * @param dt The time passed since the last update in seconds.
   */
  lateUpdate(dt: number): void {}

  /**
   * Draw gets called every frame. If you override it and don't call super.draw() entities will not be drawn.
   */
  draw(): void {}

  /**
   * Resize gets called when the window resizes.
   * @param width The new window width in pixels.
   * @param height The new window height in pixels.
   */
  resize(width: number, height: number): void {}

  /**
   * Gets called when a scene is removed from the scene manager.
   * Can be used to clean up references and data tha is no longer needed.
   */
  destroy(): void {}
}
