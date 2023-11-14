import { Image, Quad } from 'love.graphics';
import { Json } from '../lib';
import { Rectangle, Size } from '../math';

/**
 * Sprite atlas class. Having sprites in a single atlas can help with batching draw calls.
 */
export class Atlas {
  /**
   * Map of frames.
   */
  readonly frames = new LuaTable<string, AtlasFrame>();

  /**
   * The atlas image to render.
   */
  readonly image: Image;

  /**
   * Create a new atlas.
   * @param image The atlas image.
   * @param data The json string.
   */
  constructor(image: Image, data: string) {
    this.image = image;
    const atlasData: JsonAtlas = Json.decode(data);

    const width = image.getWidth();
    const height = image.getHeight();

    for (const frameData of atlasData.frames) {
      const frame = new AtlasFrame(frameData, width, height);
      this.frames.set(frame.name, frame);
    }
  }

  /**
   * Get a frame from the atlas.
   * @param name The frame name.
   * @returns The frame.
   */
  getFrame(name: string): AtlasFrame {
    return this.frames.get(name);
  }
}

/**
 * A single frame in the atlas.
 */
export class AtlasFrame {
  /**
   * The frame name.
   */
  readonly name: string;

  /**
   * The love quad to draw.
   */
  readonly quad: Quad;

  /**
   * Is this frame trimmed.
   */
  readonly trimmed: boolean;

  /**
   * The source rectangle before trimming. Has the original size and offset.
   */
  readonly sourceRect: Rectangle;

  /**
   * The frame size before trimming.
   */
  readonly sourceSize: Size;

  /**
   * Create a new frame.
   * @param frameInfo The frame info information for drawing..
   * @param imageWidth The full image width in pixels.
   * @param imageHeight The full atlas image height in pixels.
   */
  constructor(frameInfo: JsonFrame, imageWidth: number, imageHeight: number) {
    const frame = frameInfo.frame;
    const spriteSize = frameInfo.spriteSourceSize;
    const size = frameInfo.sourceSize;

    this.name = frameInfo.filename;
    this.quad = love.graphics.newQuad(frame.x, frame.y, frame.w, frame.h, imageWidth, imageHeight);
    this.trimmed = frameInfo.trimmed;
    this.sourceRect = new Rectangle(spriteSize.x, spriteSize.y, spriteSize.w, spriteSize.h);
    this.sourceSize = { width: size.w, height: size.h };
  }
}

interface JsonAtlas {
  frames: JsonFrame[];
}

interface JsonFrame {
  filename: string;
  frame: { x: number; y: number; w: number; h: number };
  trimmed: boolean;
  spriteSourceSize: { x: number; y: number; w: number; h: number };
  sourceSize: { w: number; h: number };
}
