import { Entity } from './entity';
import { EventHandler, Events } from './events';
import { Color } from './graphics';
import { Camera } from './graphics/camera';
import { View } from './view';

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

  /**
   * All cameras in the scene.
   */
  protected cameras: Camera[] = [];

  /**
   * All entity layers.
   */
  protected layers: Entity[][] = [];

  /**
   * All entities in the scene.
   */
  protected entities: Entity[] = [];

  /**
   * All events added to this scene using the global Events class.
   */
  private eventHandlers = new LuaTable<string, EventHandler[]>();

  /**
   * A list of entities to remove on the next update.
   */
  private entitiesToRemove: Entity[] = [];

  /**
   * A table of every entity and the current layer they are on.
   * Used to check if an entity moved to a different layer.
   */
  private layerTracking = new LuaTable<Entity, number>();

  /**
   * Create a new scene instance. Called by the Scene manager. Don't call this yourself.
   */
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

  /**
   * Add a new entity to the scene.
   * @param entity The entity to add.
   */
  addEntity(entity: Entity): void {
    this.entities.push(entity);
    this.layerTracking.set(entity, entity.layer);
    this.layers[entity.layer].push(entity);
  }

  /**
   * Remove an entity from the scene. It will be removed on the next update.
   * @param entity The entity to remove.
   */
  removeEntity(entity: Entity): void {
    this.entitiesToRemove.push(entity);
  }

  /**
   * Update gets called every frame. If you override it and don't call super.update() entities will not be updated.
   * @param dt The time passed since the last update in seconds.
   */
  update(dt: number): void {
    while (this.entitiesToRemove.length > 0) {
      const entity = this.entitiesToRemove.pop()!;
      if (entity.destroy) {
        entity.destroy();
      }

      // Remove the entity from entities
      let index = this.entities.indexOf(entity);
      if (index !== -1) {
        this.entities.splice(index, 1);
      }

      // Remove the entity from the layer.
      const layer = this.layerTracking.get(entity);
      index = this.layers[layer].indexOf(entity);
      if (index !== -1) {
        this.layers[layer].splice(index, 1);
      }
      this.layerTracking.set(entity, -1);
    }

    for (const entity of this.entities) {
      if (entity.active) {
        // Update layers.
        this.updateEntityLayer(entity);

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

    // Draw all entities using each camera.
    for (const camera of this.cameras) {
      if (camera.active) {
        camera.updateTransform();

        // Set the canvas to the camera canvas and clear it.
        love.graphics.setCanvas(camera.canvas);
        const [r, g, b, a] = camera.bgColor.parts();
        love.graphics.clear(r, g, b, a);

        // Apply the camera transform to render the entities in the correct place.
        love.graphics.push();
        love.graphics.applyTransform(camera.transform);

        /**
         * Render each layer of entities if the layer should not be ignored.
         */
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

    // Render all cameras to the main canvas.
    for (const camera of this.cameras) {
      love.graphics.draw(camera.canvas, camera.screenBounds.x, camera.screenBounds.y);
    }
  }

  /**
   * Resize gets called when the window resizes.
   * @param width The new window width in pixels.
   * @param height The new window height in pixels.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resize(width: number, height: number): void {
    // Resize the view of all fullscreen cameras.
    const [viewWidth, viewHeight] = View.getViewSize();
    for (const camera of this.cameras) {
      if (camera.isFullScreen) {
        camera.updateScreenBounds(0, 0, viewWidth, viewHeight);
      }
    }
  }

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

  /**
   * Check if an entity has move to a different layer and move it to that layer if true.
   * @param entity The entity to check.
   */
  protected updateEntityLayer(entity: Entity): void {
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
  }
}
