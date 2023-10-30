import { Canvas } from 'love.graphics';
import { Transform } from 'love.math';
import { LiloMath, Point, Rectangle } from '../math';
import { View } from '../view';
import { Color } from './color';

/**
 * Game camera class.
 */
export class Camera {
  /**
   * Only active cameras draw entities.
   */
  active = true;

  /**
   * The camera position in the world.
   */
  position = new Point();

  /**
   * The camera rotation angle in degrees.
   */
  angle = 0;

  /**
   * The camera zoom.
   */
  zoom = 1.0;

  /**
   * The love transform to apply when rendering using this camera.
   */
  transform: Transform;

  /**
   * The camera background color.
   */
  bgColor: Color;

  /**
   * Layers not to render using this camera.
   */
  ignoredLayers: number[] = [];

  /**
   * The camera bounds in the world. Don't set this yourself.
   * This is calculated automatically.
   */
  bounds = new Rectangle();

  /**
   * The camera screen bounds.
   */
  screenBounds = new Rectangle();

  /**
   * The canvas the camera draws to.
   */
  canvas!: Canvas;

  /**
   * The rectangle that the camera covers inside the screen. All values are (0 - 1);
   */
  private viewRect = new Rectangle();

  /**
   * Create a new camera.
   * @param options The initialization options.
   */
  constructor({ x, y, angle, zoom, viewX, viewY, viewWidth, viewHeight, bgColor, ignoredLayers }: CameraOptions = {}) {
    const [mainViewWidth, mainViewHeight] = View.getViewSize();
    this.position.set(x ?? mainViewWidth * 0.5, y ?? mainViewHeight * 0.5);
    this.angle = angle ?? 0;
    this.zoom = zoom ?? 1.0;
    this.transform = love.math.newTransform();
    this.bgColor = bgColor ?? Color.BLACK;
    this.ignoredLayers = ignoredLayers ?? [];
    this.updateView(viewX ?? 0, viewY ?? 0, viewWidth ?? 1, viewHeight ?? 1);
    this.updateBounds();
  }

  /**
   * Update the love transform.
   */
  updateTransform(): void {
    this.updateBounds();
    this.transform.reset();
    this.transform
      .translate(this.screenBounds.width * 0.5, this.screenBounds.height * 0.5)
      .rotate(math.rad(this.angle))
      .scale(this.zoom, this.zoom)
      .translate(-this.position.x, -this.position.y);
  }

  /**
   * Update the camera position and size inside the view. 0 is top left. 1 is bottom right.
   * @param x The top left x position (0 - 1).
   * @param y The top left y position (0 - 1).
   * @param width The width of the camera inside the view (0 - 1).
   * @param height The height of the camera inside the view (0 - 1).
   */
  updateView(x: number, y: number, width: number, height: number): void {
    x = LiloMath.clamp(x, 0, 1);
    y = LiloMath.clamp(y, 0, 1);
    width = LiloMath.clamp(width, 0, 1);
    height = LiloMath.clamp(height, 0, 1);
    this.viewRect.set(x, y, width, height);

    const [viewWidth, viewHeight] = View.getViewSize();

    this.screenBounds.set(x * viewWidth, y * viewHeight, width * viewWidth, height * viewHeight);
    this.canvas = love.graphics.newCanvas(width * viewWidth, height * viewHeight);
  }

  /**
   * Update the camera bounds inside the game world.
   */
  updateBounds(): void {
    this.bounds.x = this.position.x - (this.screenBounds.width * 0.5) / this.zoom;
    this.bounds.y = this.position.y - (this.screenBounds.height * 0.5) / this.zoom;
    this.bounds.width = this.screenBounds.width / this.zoom;
    this.bounds.height = this.screenBounds.height / this.zoom;
  }

  /**
   * Resize the camera inside the view. Called when the screen resizes.
   */
  resize(): void {
    this.updateView(this.viewRect.x, this.viewRect.y, this.viewRect.width, this.viewRect.height);
    this.updateBounds();
  }

  /**
   * Convert a screen position to a world position.
   * @param x The x screen position in pixels.
   * @param y The y screen position in pixels.
   * @returns The x and y world position in pixels.
   */
  screenToWorld(x: number, y: number): LuaMultiReturn<[number, number]> {
    const [windowWidth, windowHeight] = View.getWindowSize();
    const tempX =
      this.position.x -
      (this.screenBounds.width * 0.5) / this.zoom +
      (x / windowWidth) * (this.screenBounds.width / this.zoom);
    const tempY =
      this.position.y -
      (this.screenBounds.height * 0.5) / this.zoom +
      (y / windowHeight) * (this.screenBounds.height / this.zoom);

    const [worldX, worldY] = LiloMath.rotateAround(tempX, tempY, this.position.x, this.position.y, -this.angle);

    return $multi(worldX, worldY);
  }

  /**
   * Convert a screen position to a view position.
   * @param x The x screen position in pixels.
   * @param y The y screen position in pixels.
   * @returns The x and y view position in pixels.
   */
  screenToView(x: number, y: number): LuaMultiReturn<[number, number]> {
    const [windowWidth, windowHeight] = View.getWindowSize();
    const [viewWidth, viewHeight] = View.getViewSize();

    const worldX = (x / windowWidth) * viewWidth;
    const worldY = (y / windowHeight) * viewHeight;

    return $multi(worldX, worldY);
  }
}

/**
 * Camera initialization options.
 */
export interface CameraOptions {
  /**
   * The x position of the center of the camera in world pixels.
   */
  x?: number;

  /**
   * The y position of the center of the camera in world pixels.
   */
  y?: number;

  /**
   * The rotation angle in degrees.
   */
  angle?: number;

  /**
   * The camera zoom.
   */
  zoom?: number;

  /**
   * The x position inside the view (0 - 1).
   */
  viewX?: number;

  /**
   * The y position inside the view (0 - 1).
   */
  viewY?: number;

  /**
   * The width inside the view (0 - 1).
   */
  viewWidth?: number;

  /**
   * The height inside the view (0 - 1).
   */
  viewHeight?: number;

  /**
   * The camera background color.
   */
  bgColor?: Color;

  /**
   * Layers to skip when drawing.
   */
  ignoredLayers?: number[];
}
