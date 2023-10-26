import { Events } from './events';

/**
 * Base event class.
 */
export class Event {
  /**
   * Has this event been canceled. If an event is canceled inside a handler,
   * he remaining handlers in the list don't receive the event.
   */
  canceled = false;

  /**
   * The event type. Built-in events start with 'lilo_'.
   */
  typeName = '';

  /**
   * Events are intended to be used with object pools. Override this to put the event back in the pool.
   */
  put(): void {
    this.canceled = false;
  }

  /**
   * Send this event. This is an alias for `Events.send(event);`.
   */
  send(): void {
    Events.send(this);
  }
}

/**
 * The event type makes it possible to have type safe callbacks when adding handlers in the event system.
 */
export class EventType<T extends Event> {
  /**
   * The type of event that will be sent.
   */
  readonly type: new (...args: any[]) => T;

  /**
   * The internal name for this particular event. (key_pressed) for example.
   */
  readonly typeName: string;

  /**
   * Create a new event type.
   * @param type The type of event that will be sent.
   * @param typeName The internal name for this particular event.
   */
  constructor(type: new (...args: any[]) => T, typeName: string) {
    this.type = type;
    this.typeName = typeName;
  }
}
