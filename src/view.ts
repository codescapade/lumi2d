/**
 * The view class has view related information like design, view, and window size.
 * @noSelf
 */
export class View {
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
   * The scale factor to scale from view to window.
   */
  private static viewScaleFactor = 1.0;

  /**
   * Initialize the View. This gets called automatically by the Game class on startup.
   * @param width The width the game is designed for in pixels.
   * @param height The height the game is designed for in pixels.
   */
  static init(width: number, height: number): void {
    View.designWidth = width;
    View.designHeight = height;
    View.scaleToWindow();
  }

  /**
   * Scale the design size to fit the window. The result will be the view size.
   * TODO: Add scale modes.
   */
  static scaleToWindow(): void {
    const windowWidth = love.graphics.getWidth();
    const windowHeight = love.graphics.getHeight();

    const designRatio = View.designWidth / View.designHeight;
    const windowRatio = windowWidth / windowHeight;

    if (windowRatio < designRatio) {
      View.viewWidth = View.designWidth;
      View.viewHeight = Math.ceil(View.viewWidth / windowRatio);
    } else {
      View.viewHeight = View.designHeight;
      View.viewWidth = Math.ceil(View.viewHeight * windowRatio);
    }

    View.viewScaleFactor = windowWidth / View.viewWidth;
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
   * @returns The scale factor.
   */
  static getViewScaleFactor(): number {
    return View.viewScaleFactor;
  }
}
