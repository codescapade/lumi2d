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
   * The camera rotation angle.
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
   * The camera bounds in the world.
   */
  bounds = new Rectangle();

  /**
   * The camera screen bounds.
   */
  screenBounds = new Rectangle();
  canvas: Canvas;

  isFullScreen = true;

  constructor(options?: CameraOptions) {
    if (!options) {
      options = {};
    }

    const [viewWidth, viewHeight] = View.getViewSize();
    this.position.set(options.x ?? viewWidth * 0.5, options.y ?? viewHeight * 0.5);
    this.angle = options.angle ?? 0;
    this.zoom = options.zoom ?? 1.0;
    this.transform = love.math.newTransform();
    this.bgColor = options.bgColor ?? Color.BLACK;
    this.ignoredLayers = options.ignoredLayers ?? [];
    this.screenBounds.set(
      options.viewX ?? 0,
      options.viewY ?? 0,
      options.viewWidth ?? viewWidth,
      options.viewHeight ?? viewHeight
    );

    if (options.isFullScreen !== undefined) {
      this.isFullScreen = options.isFullScreen;
    }

    this.canvas = love.graphics.newCanvas(options.viewWidth ?? viewWidth, options.viewHeight ?? viewHeight);
    this.updateBounds();
  }

  updateTransform(): void {
    this.updateBounds();
    this.transform.reset();
    this.transform
      .translate(this.screenBounds.width * 0.5, this.screenBounds.height * 0.5)
      .rotate(math.rad(this.angle))
      .scale(this.zoom, this.zoom)
      .translate(-this.position.x, -this.position.y);
  }

  updateScreenBounds(x: number, y: number, width: number, height: number): void {
    this.screenBounds.set(x, y, width, height);
    this.canvas = love.graphics.newCanvas(width, height);
  }

  updateBounds(): void {
    this.bounds.x = this.position.x - (this.screenBounds.width * 0.5) / this.zoom;
    this.bounds.y = this.position.y - (this.screenBounds.height * 0.5) / this.zoom;
    this.bounds.width = this.screenBounds.width / this.zoom;
    this.bounds.height = this.screenBounds.height / this.zoom;
  }

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

    const [worldX, worldY] = LiloMath.rotateAround(tempX, tempY, this.position.x, this.position.y, this.angle);

    return $multi(worldX, worldY);
  }

  screenToView(x: number, y: number): LuaMultiReturn<[number, number]> {
    const [windowWidth, windowHeight] = View.getWindowSize();
    const [viewWidth, viewHeight] = View.getViewSize();

    const tempX = (x / windowWidth) * viewWidth;
    const tempY = (y / windowHeight) * viewHeight;

    const [worldX, worldY] = LiloMath.rotateAround(tempX, tempY, this.position.x, this.position.y, this.angle);

    return $multi(worldX, worldY);
  }
}

export interface CameraOptions {
  x?: number;
  y?: number;
  angle?: number;
  zoom?: number;
  viewX?: number;
  viewY?: number;
  viewWidth?: number;
  viewHeight?: number;
  bgColor?: Color;
  ignoredLayers?: number[];
  isFullScreen?: boolean;
}
