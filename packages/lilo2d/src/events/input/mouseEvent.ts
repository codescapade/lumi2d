import { Event, EventType } from '../event';

/**
 * Mouse input event.
 */
export class MouseEvent extends Event {
  /**
   * Mouse button pressed type.
   */
  static readonly BUTTON_PRESSED = new EventType(MouseEvent, 'lilo_mouse_button_pressed');

  /**
   * Mouse button released type.
   */
  static readonly BUTTON_RELEASED = new EventType(MouseEvent, 'lilo_mouse_button_released');

  /**
   * Mouse moved type.
   */
  static readonly MOVED = new EventType(MouseEvent, 'lilo_mouse_moved');

  /**
   * The x screen position in pixels.
   */
  x!: number;

  /**
   * The y screen position in pixels.
   */
  y!: number;

  /**
   * The button pressed or released.
   */
  button?: number;

  /**
   * Is this a touch.
   */
  isTouch?: boolean;

  /**
   * The amount moved on the x axis since the last event in pixels.
   */
  dx?: number;

  /**
   * The amount moved on the y axis since the last event in pixels.
   */
  dy?: number;

  /**
   * The event object pool.
   */
  private static pool: MouseEvent[] = [];

  /**
   *
   * @param type The event type.
   * @param x The x screen position in pixels.
   * @param y The y screen position in pixels.
   * @param button The button pressed or released.
   * @param isTouch Is this a touch.
   * @param dx The amount moved on the x axis since the last event in pixels.
   * @param dy The amount moved on the y axis since the last event in pixels.
   * @returns The event from the pool.
   * @noSelf
   */
  static get<T extends MouseEvent>(
    type: EventType<T>,
    x: number,
    y: number,
    button?: number,
    isTouch?: boolean,
    dx?: number,
    dy?: number
  ): MouseEvent {
    let event: MouseEvent;
    if (MouseEvent.pool.length > 0) {
      event = MouseEvent.pool.pop()!;
    } else {
      event = new MouseEvent();
    }
    event.reset(type.typeName, x, y, button, isTouch, dx, dy);

    return event;
  }

  /**
   * Remove all objects from the pool.
   */
  static clearPool(): void {
    while (MouseEvent.pool.length > 0) {
      MouseEvent.pool.pop();
    }
  }

  /**
   * Puts the event back into the pool.
   */
  override put(): void {
    super.put();
    MouseEvent.pool.push(this);
  }

  /**
   * Set new values on an event.
   * @param typeName The event type name.
   * @param x
   * @param y
   * @param button
   * @param isTouch
   * @param dx
   * @param dy
   */
  private reset(
    typeName: string,
    x: number,
    y: number,
    button?: number,
    isTouch?: boolean,
    dx?: number,
    dy?: number
  ): void {
    this.typeName = typeName;
    this.x = x;
    this.y = y;
    this.button = button;
    this.isTouch = isTouch;
    this.dx = dx;
    this.dy = dy;
  }
}
