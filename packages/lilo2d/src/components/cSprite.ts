import { Atlas, AtlasFrame, Color } from '../graphics';
import { Point } from '../math';

/**
 * Sprite component.
 */
export class CSprite {
  /**
   * The draw anchor.
   */
  anchor = new Point(0.5, 0.5);

  /**
   * The tint color.
   */
  color: Color;

  /**
   * The atlas to render from.
   */
  atlas!: Atlas;

  /**
   * The frame to draw.
   */
  private frame!: AtlasFrame;

  constructor(options: CSpriteOptions) {
    this.anchor.x = options.anchorX ?? 0.5;
    this.anchor.y = options.anchorY ?? 0.5;
    this.color = options.color ?? Color.WHITE;
    this.setFrame(options.frameName, options.atlas);
  }

  /**
   * The current frame name.
   * @returns The frame name.
   */
  getFrameName(): string {
    return this.frame.name;
  }

  /**
   * Set a new frame to draw.
   * @param frameName The name of the frame.
   * @param atlas The atlas to use. Optional.
   */
  setFrame(frameName: string, atlas?: Atlas): void {
    if (atlas) {
      this.atlas = atlas;
    }

    if (!this.atlas) {
      return;
    }

    this.frame = this.atlas.getFrame(frameName);

    if (!this.frame) {
      print(`frame ${frameName} not found in atlas`);
    }
  }

  /**
   * Draw the sprite.
   * @param x The x position in pixels.
   * @param y The y position in pixels.
   * @param angle The angle in degrees.
   * @param scaleX The x axis scale.
   * @param scaleY The y axis scale.
   */
  draw(x: number, y: number, angle: number, scaleX: number, scaleY: number): void {
    const [r, g, b, a] = this.color.parts();
    love.graphics.setColor(r, g, b, a);
    love.graphics.draw(
      this.atlas.image,
      this.frame.quad,
      x,
      y,
      angle,
      scaleX,
      scaleY,
      this.frame.sourceSize.width * this.anchor.x - this.frame.sourceRect.x,
      this.frame.sourceSize.height * this.anchor.y - this.frame.sourceRect.y
    );
  }

  /**
   * Get the sprite width in pixels.
   * @returns The width.
   */
  getWidth(): number {
    return this.frame.sourceSize.width;
  }

  /**
   * Get the sprite height in pixels.
   * @returns The height.
   */
  getHeight(): number {
    return this.frame.sourceSize.height;
  }
}

/**
 * The sprite component initial values.
 */
export interface CSpriteOptions {
  /**
   * The atlas to use.
   */
  atlas: Atlas;

  /**
   * The frame to display.
   */
  frameName: string;

  /**
   * The x axis anchor.
   */
  anchorX?: number;

  /**
   * The y axis anchor.
   */
  anchorY?: number;

  /**
   * The tint color.
   */
  color?: Color;
}
