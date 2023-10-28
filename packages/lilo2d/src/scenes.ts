import { Entity } from './entity';
import { EventHandler, Events } from './events';
import { Color } from './graphics';
import { Camera } from './graphics/camera';

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
      Events.setSceneHandlers(Scenes.current().getEventHandlers());
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
      // Set the events to the below scene until everything has been loaded.
      Events.setSceneHandlers(scene.getEventHandlers());
      scene.load();

      // Set the events back to the current scene.
      Events.setSceneHandlers(Scenes.current().getEventHandlers());
    } else {
      Scenes.sceneStack.push(scene);
      Events.setSceneHandlers(scene.getEventHandlers());
      scene.load();
    }
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

  cameras: Camera[] = [];

  layers: Entity[][] = [];

  entities: Entity[] = [];

  /**
   * All events added to this scene using the global Events class.
   */
  private eventHandlers = new LuaTable<string, EventHandler[]>();

  private entitiesToRemove: Entity[] = [];

  private layerTracking = new LuaTable<Entity, number>();

  constructor() {
    for (const _ of $range(1, 16)) {
      this.layers.push([]);
    }
    // Add a default camera to the scene.
    this.cameras.push(new Camera());
  }

  /**
   * Load gets called after creating the scene. This can be used to create entities, load tilemaps, etc.
   */
  load(): void {}

  addEntity(entity: Entity): void {
    this.entities.push(entity);
    this.layerTracking.set(entity, entity.layer);
    this.layers[entity.layer].push(entity);
  }

  removeEntity(entity: Entity): void {
    this.entitiesToRemove.push(entity);
  }

  /**
   * Update gets called every frame. If you override it and don't call super.update() entities will not be updated.
   * @param dt The time passed since the last update in seconds.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(dt: number): void {
    while (this.entitiesToRemove.length > 0) {
      const entity = this.entitiesToRemove.pop()!;
      if (entity.destroy) {
        entity.destroy();
      }

      let index = this.entities.indexOf(entity);
      if (index !== -1) {
        this.entities.splice(index, 1);
      }

      const layer = this.layerTracking.get(entity);
      index = this.layers[layer].indexOf(entity);
      if (index !== -1) {
        this.layers[layer].splice(index, 1);
      }
      this.layerTracking.set(entity, -1);
    }

    for (const entity of this.entities) {
      if (entity.active) {
        // Update entity layer if it has changed.
        const layer = entity.layer;
        const currentLayer = this.layerTracking.get(entity);
        if (currentLayer !== layer) {
          const index = this.layers[currentLayer].indexOf(entity);
          if (index !== -1) {
            this.layers[currentLayer].splice(index, 1);
          }
          this.layerTracking.set(entity, layer);
          this.layers[layer].push(entity);
        }

        // Update the entity.
        if (entity.update) {
          entity.update(dt);
        }
      }
    }
  }

  /**
   * Late update gets called after update. Sometimes it is useful to update entities again after the first update.
   * For example if there is a physics update in between.
   * @param dt The time passed since the last update in seconds.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  lateUpdate(dt: number): void {
    for (const entity of this.entities) {
      if (entity.active && entity.lateUpdate) {
        entity.lateUpdate(dt);
      }
    }
  }

  /**
   * Draw gets called every frame. If you override it and don't call super.draw() entities will not be drawn.
   */
  draw(): void {
    const [currentCanvas] = love.graphics.getCanvas();
    for (const camera of this.cameras) {
      if (camera.active) {
        camera.updateTransform();

        love.graphics.setCanvas(camera.canvas);
        const [r, g, b, a] = camera.bgColor.parts();
        love.graphics.clear(r, g, b, a);

        love.graphics.push();
        love.graphics.applyTransform(camera.transform);

        for (let i = 0; i < this.layers.length; i++) {
          if (!camera.ignoredLayers.includes(i)) {
            const layer = this.layers[i];
            for (const entity of layer) {
              if (entity.active && entity.draw) {
                entity.draw();
              }
            }
          }
        }

        love.graphics.pop();
      }
    }
    love.graphics.setCanvas(currentCanvas);
    love.graphics.origin();
    const [r, g, b, a] = Color.WHITE.parts();
    love.graphics.setColor(r, g, b, a);

    for (const camera of this.cameras) {
      love.graphics.draw(camera.canvas, camera.drawBounds.x, camera.drawBounds.y);
    }
  }

  /**
   * Resize gets called when the window resizes.
   * @param width The new window width in pixels.
   * @param height The new window height in pixels.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resize(width: number, height: number): void {}

  /**
   * Gets called when a scene is removed from the scene manager.
   * Can be used to clean up references and data tha is no longer needed.
   */
  destroy(): void {}

  /**
   * Get the scene event handlers.
   * @returns The event handlers.
   */
  getEventHandlers(): LuaTable<string, EventHandler[]> {
    return this.eventHandlers;
  }
}
