import { Transform } from 'love.math';
import { Color } from './color';
import { Rectangle } from '../math';
import { Canvas } from 'love.graphics';
import { View } from '../view';
import { LiloMath } from '../math/liloMath';

export class Camera {
  active = true;
  x = 0;
  y = 0;
  angle = 0;
  zoom = 1.0;
  transform: Transform;
  bgColor: Color;
  ignoredLayers: number[] = [];
  bounds = new Rectangle();
  drawBounds = new Rectangle();
  canvas: Canvas;

  constructor(options?: CameraOptions) {
    if (!options) {
      options = {};
    }

    const [viewWidth, viewHeight] = View.getViewSize();
    this.x = options.x ?? viewWidth * 0.5;
    this.y = options.y ?? viewHeight * 0.5;
    this.angle = options.angle ?? 0;
    this.zoom = options.zoom ?? 1.0;
    this.transform = love.math.newTransform();
    this.bgColor = options.bgColor ?? Color.BLACK;
    this.ignoredLayers = options.ignoredLayers ?? [];
    this.drawBounds.set(
      options.viewX ?? 0,
      options.viewY ?? 0,
      options.viewWidth ?? viewWidth,
      options.viewHeight ?? viewHeight
    );
    this.canvas = love.graphics.newCanvas(options.viewWidth ?? viewWidth, options.viewHeight ?? viewHeight);
    this.updateBounds();
  }

  updateTransform(): void {
    this.updateBounds();
    this.transform.reset();
    this.transform
      .translate(this.drawBounds.width * 0.5, this.drawBounds.height * 0.5)
      .rotate(math.rad(this.angle))
      .scale(this.zoom, this.zoom)
      .translate(-this.x, -this.y);
  }

  updateDrawBounds(x: number, y: number, width: number, height: number): void {
    this.drawBounds.set(x, y, width, height);
    this.canvas = love.graphics.newCanvas(width, height);
  }

  updateBounds(): void {
    this.bounds.x = this.x - (this.drawBounds.width * 0.5) / this.zoom;
    this.bounds.y = this.y - (this.drawBounds.height * 0.5) / this.zoom;
    this.bounds.width = this.drawBounds.width / this.zoom;
    this.bounds.height = this.drawBounds.height / this.zoom;
  }

  screenToWorld(x: number, y: number): LuaMultiReturn<[number, number]> {
    const [windowWidth, windowHeight] = View.getWindowSize();
    const tempX =
      this.x - (this.drawBounds.width * 0.5) / this.zoom + (x / windowWidth) * (this.drawBounds.width / this.zoom);
    const tempY =
      this.y - (this.drawBounds.height * 0.5) / this.zoom + (y / windowHeight) * (this.drawBounds.height / this.zoom);

    const [worldX, worldY] = LiloMath.rotateAround(tempX, tempY, this.x, this.y, this.angle);

    return $multi(worldX, worldY);
  }

  screenToView(x: number, y: number): LuaMultiReturn<[number, number]> {
    const [windowWidth, windowHeight] = View.getWindowSize();
    const [viewWidth, viewHeight] = View.getViewSize();

    const tempX = (x / windowWidth) * viewWidth;
    const tempY = (y / windowHeight) * viewHeight;

    const [worldX, worldY] = LiloMath.rotateAround(tempX, tempY, this.x, this.y, this.angle);

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
}
