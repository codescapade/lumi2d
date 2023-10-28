import { Font, Image } from 'love.graphics';

/**
 * Asset manager class.
 */
export class Assets {
  /**
   * All loaded images.
   */
  private static images = new LuaTable<string, Image>();

  /**
   * All loaded fonts.
   */
  private static fonts = new LuaTable<string, Font>();

  /**
   * Load an image.
   * @param name The name to store it as.
   * @param path The image path.
   * @param keep Should this image be stored in the manager.
   * @returns The loaded image.
   */
  static loadImage(name: string, path: string, keep = true): Image {
    const image = love.graphics.newImage(path);
    if (keep) {
      Assets.images.set(name, image);
    }

    return image;
  }

  /**
   * Get a loaded image from the manager.
   * @param name The image name.
   * @returns The image.
   */
  static getImage(name: string): Image {
    return Assets.images.get(name);
  }

  /**
   * Remove the image from the manager.
   * @param name The image name.
   */
  static removeImage(name: string): void {
    if (Assets.images.has(name)) {
      Assets.images.delete(name);
    }
  }

  /**
   * Load a font.
   * @param name The name to store it as.
   * @param size The font size.
   * @param path Optional font path.
   * @param keep Should this image be stored in the manager.
   * @returns The loaded font.
   */
  static loadFont(name: string, size: number, path?: string, keep = true): Font {
    let font: Font;
    if (path) {
      font = love.graphics.newFont(path, size);
    } else {
      font = love.graphics.newFont(size);
    }
    if (keep) {
      Assets.fonts.set(name, font);
    }

    return font;
  }

  /**
   * Get a loaded font from the manager.
   * @param name The font name.
   * @returns The font.
   */
  static getFont(name: string): Font {
    return Assets.fonts.get(name);
  }

  /**
   * Remove a font from the manager.
   * @param name The font name.
   */
  static removeFont(name: string): void {
    if (Assets.fonts.has(name)) {
      Assets.fonts.delete(name);
    }
  }
}
