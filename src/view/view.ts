import { ScaleMode, scaleModeFitView } from './scaleMode';

/**
 * The view class has view related information like design, view, and window size.
 * @noSelf
 */
export class View {
  /**
   * The x axis anchor offset. If the view is smaller than the window this moves the view.
   */
  static viewAnchorX = 0;

  /**
   * The y axis anchor offset. If the view is smaller than the window this moves the view.
   */
  static viewAnchorY = 0;

  /**
   * The current scale mode.
   */
  private static scaleMode: ScaleMode;
  /**
   * The width the game is designed for in pixels.
   */
  private static designWidth = 0;

  /**
   * The height the game is designed for in pixels.
   */
  private static designHeight = 0;

  /**
   * The scaled view width in pixels.
   */
  private static viewWidth = 0;

  /**
   * The scaled view height in pixels.
   */
  private static viewHeight = 0;

  /**
   * The x scale factor to scale from view to window.
   */
  private static viewScaleFactorX = 1.0;

  /**
   * The y scale factor to scale from view to window.
   */
  private static viewScaleFactorY = 1.0;

  /**
   * The x axis view offset.
   */
  private static viewOffsetX = 0;

  /**
   * The x axis view offset.
   */
  private static viewOffsetY = 0;

  /**
   * Initialize the View. This gets called automatically by the Game class on startup.
   * @param width The width the game is designed for in pixels.
   * @param height The height the game is designed for in pixels.
   */
  static init(width: number, height: number): void {
    View.designWidth = width;
    View.designHeight = height;
    View.scaleMode = scaleModeFitView;
    View.scaleToWindow();
  }

  /**
   * Scale the design size to fit the window. The result will be the view size.
   */
  static scaleToWindow(): void {
    [
      View.viewWidth,
      View.viewHeight,
      View.viewScaleFactorX,
      View.viewScaleFactorY,
      View.viewOffsetX,
      View.viewOffsetY,
    ] = View.scaleMode(View.designWidth, View.designHeight, View.viewAnchorX, View.viewAnchorY);
  }

  /**
   * Set a new scale mode.
   * @param mode The new scale mode.
   */
  static setScaleMode(mode: ScaleMode): void {
    View.scaleMode = mode;
    View.scaleToWindow();
  }

  /**
   * Get the design size in pixels.
   * @returns The design width and height.
   */
  static getDesignSize(): LuaMultiReturn<[number, number]> {
    return $multi(View.designWidth, View.designHeight);
  }

  /**
   * Get the view size in pixels. This is the design size scaled to fit the window.
   * @returns The view width and height.
   */
  static getViewSize(): LuaMultiReturn<[number, number]> {
    return $multi(View.viewWidth, View.viewHeight);
  }

  /**
   * Get the view center in pixels.
   * @returns The x and y position of the view center.
   */
  static getViewCenter(): LuaMultiReturn<[number, number]> {
    return $multi(Math.floor(View.viewWidth * 0.5), Math.floor(View.viewHeight * 0.5));
  }

  /**
   * Get the window size in pixels.
   * @returns The window width and height.
   */
  static getWindowSize(): LuaMultiReturn<[number, number]> {
    return $multi(love.graphics.getWidth(), love.graphics.getHeight());
  }

  /**
   * Get the window center in pixels.
   * @returns The x and y position of the window center.
   */
  static getWindowCenter(): LuaMultiReturn<[number, number]> {
    return $multi(Math.floor(love.graphics.getWidth() * 0.5), Math.floor(love.graphics.getHeight() * 0.5));
  }

  /**
   * Get the view scale factor from scaling the design size to fix the window size.
   * This is used the scale the main canvas to fit the game window.
   * @returns The scale x and y factor.
   */
  static getViewScaleFactor(): LuaMultiReturn<[number, number]> {
    return $multi(View.viewScaleFactorX, View.viewScaleFactorY);
  }

  /**
   * Get the view offset inside the window.
   * @returns The x and y offset.
   */
  static getViewOffset(): LuaMultiReturn<[number, number]> {
    return $multi(View.viewOffsetX, View.viewOffsetY);
  }
}
