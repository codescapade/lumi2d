/**
 * Entities are objects in the game that can be updated or drawn.
 * Implement this to be able to add you entity to the scene.
 */
export interface Entity {
  /**
   * Active entities receive update and draw calls.
   */
  active: boolean;
  /**
   * The layer to render to. Should be a integer (0 - 15).
   */
  layer: number;

  /**
   * Optional update function.
   * @param dt Time passed since the last update in seconds.
   */
  update?: (dt: number) => void;

  /**
   * Optional late update function.
   * @param dt Time passed since the last update in seconds.
   */
  lateUpdate?: (dt: number) => void;

  /**
   * Optional draw function to draw sprites for example.
   */
  draw?: () => void;

  /**
   * Optional destroy function for cleanup.
   */
  destroy?: () => void;
}
