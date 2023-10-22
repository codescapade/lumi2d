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

  put(): void {
    this.canceled = false;
  }
}

export class EventType<T extends Event> {
  readonly type: new (...args: any[]) => T;
  readonly typeName: string;

  constructor(type: new (...args: any[]) => T, typeName: string) {
    this.type = type;
    this.typeName = typeName;
  }
}
