import { Font, Image } from 'love.graphics';
import { Atlas } from './graphics';
import { Source, SourceType } from 'love.audio';

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
   * All loaded sprite atlases.
   */
  private static atlases = new LuaTable<string, Atlas>();

  /**
   * All loaded sounds.
   */
  private static sounds = new LuaTable<string, Source>();

  /**
   * All loaded text files.
   */
  private static texts = new LuaTable<string, string>();

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
   * @param keep Should this font be stored in the manager.
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

  /**
   * Load a text file.
   * @param name The text name.
   * @param path The file path.
   * @param keep Should this text be stored in the manager.
   * @returns The text as a string.
   */
  static loadText(name: string, path: string, keep = true): string {
    const [content] = love.filesystem.read(path);
    if (keep) {
      Assets.texts.set(name, content!);
    }

    return content!;
  }

  /**
   * Get a loaded text from the manager.
   * @param name The text name.
   * @returns The text.
   */
  static getText(name: string): string {
    return Assets.texts.get(name);
  }

  /**
   * Remove text from the manager.
   * @param name The text name.
   */
  static removeText(name: string): void {
    Assets.texts.delete(name);
  }

  /**
   * Load a sprite atlas.
   * @param name The atlas name.
   * @param imagePath The path to the image.
   * @param dataPath The path to the json file.
   * @param keep Should this atlas be stored in the manager.
   * @returns The loaded atlas.
   */
  static loadAtlas(name: string, imagePath: string, dataPath: string, keep = true): Atlas {
    const image = Assets.loadImage(`lumi_atlas_${name}`, imagePath, keep);
    const data = Assets.loadText(`lumi_atlas_${name}`, dataPath, keep);
    const atlas = new Atlas(image, data);

    if (keep) {
      Assets.atlases.set(name, atlas);
    }

    return atlas;
  }

  /**
   * Get a loaded atlas from the manager.
   * @param name The atlas name.
   * @returns The atlas.
   */
  static getAtlas(name: string): Atlas {
    return Assets.atlases.get(name);
  }

  /**
   * Remove atlas from the manager.
   * @param name The atlas name.
   */
  static removeAtlas(name: string): void {
    Assets.atlases.delete(name);
    Assets.removeImage(`lumi_atlas_${name}`);
    Assets.removeText(`lumi_atlas_${name}`);
  }

  /**
   * Load a sound file.
   * @param name The name for the sound.
   * @param path The file path to the sound.
   * @param type The type of sound (static, stream, queue)
   * @param keep Should this sound be stored in the manager.
   * @returns The loaded sound.
   */
  static loadSound(name: string, path: string, type: SourceType, keep = true): Source {
    const source = love.audio.newSource(path, type);

    if (keep) {
      Assets.sounds.set(name, source);
    }

    return source;
  }

  /**
   * Get a loaded sound from the manager.
   * @param name The sound name.
   * @returns The sound.
   */
  static getSound(name: string): Source {
    return Assets.sounds.get(name);
  }

  /**
   * Remove sound from the manager.
   * @param name The sound name.
   */
  static removeSound(name: string): void {
    Assets.sounds.delete(name);
  }
}
