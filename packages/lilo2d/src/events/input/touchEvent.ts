import { LightUserData } from 'love';
import { Event, EventType } from '../event';

/**
 * Touch input event.
 */
export class TouchEvent extends Event {
  /**
   * Touch pressed type.
   */
  static readonly PRESSED = new EventType(TouchEvent, 'lilo_touch_pressed');

  /**
   * Touch released type.
   */
  static readonly RELEASED = new EventType(TouchEvent, 'lilo_touch_released');

  /**
   * Touch moved type.
   */
  static readonly MOVED = new EventType(TouchEvent, 'lilo_touch_moved');

  /**
   * The id of the touch.
   */
  id!: LightUserData<'Touch'>;

  /**
   * The x screen position in pixels.
   */
  x!: number;

  /**
   * The y screen position in pixels.
   */
  y!: number;

  /**
   * The amount moved on the x axis since the last event in pixels.
   */
  dx!: number;

  /**
   * The amount moved on the y axis since the last event in pixels.
   */
  dy!: number;

  /**
   * The touch pressure.
   */
  pressure!: number;

  /**
   * An array of all active touches.
   */
  touches: LightUserData<'Touch'>[] = [];

  /**
   * The event object pool.
   */
  private static pool: TouchEvent[] = [];

  /**
   *
   * @param type The event type.
   * @param id The touch id.
   * @param x The x screen position in pixels.
   * @param y The y screen position in pixels.
   * @param dx The amount moved on the x axis since the last event in pixels.
   * @param dy The amount moved on the y axis since the last event in pixels.
   * @param pressure The touch pressure.
   * @returns The event from the pool.
   * @noSelf
   */
  static get<T extends TouchEvent>(
    type: EventType<T>,
    id: LightUserData<'Touch'>,
    x: number,
    y: number,
    dx: number,
    dy: number,
    pressure: number
  ): TouchEvent {
    let event: TouchEvent;
    if (TouchEvent.pool.length > 0) {
      event = TouchEvent.pool.pop()!;
    } else {
      event = new TouchEvent();
    }
    event.reset(type.typeName, id, x, y, dx, dy, pressure);

    return event;
  }

  /**
   * Remove all objects from the pool.
   */
  static clearPool(): void {
    while (TouchEvent.pool.length > 0) {
      TouchEvent.pool.pop();
    }
  }

  /**
   * Puts the event back into the pool.
   */
  override put(): void {
    super.put();
    TouchEvent.pool.push(this);
  }

  /**
   * Set new values on an event.
   * @param typeName The event type name.
   * @param id
   * @param x
   * @param y
   * @param dx
   * @param dy
   * @param pressure
   */
  private reset(
    typeName: string,
    id: LightUserData<'Touch'>,
    x: number,
    y: number,
    dx: number,
    dy: number,
    pressure: number
  ): void {
    this.typeName = typeName;
    this.id = id;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.pressure = pressure;
    this.touches = love.touch.getTouches();
  }
}
