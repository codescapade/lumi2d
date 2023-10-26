import { Event, EventType } from './event';

/**
 * Callback type for any event.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventCallback = (event: any) => void;

/**
 * Handler to store a callback for an event.
 */
export class EventHandler {
  /**
   * The callback function to call when the event is triggered.
   */
  callback: EventCallback;

  /**
   * If true this callback can cancel the event.
   */
  canCancel: boolean;

  /**
   * Create a new handler.
   * @param callback The callback function.
   * @param canCancel Can this callback cancel the event.
   */
  constructor(callback: EventCallback, canCancel: boolean) {
    this.callback = callback;
    this.canCancel = canCancel;
  }
}

/**
 * Event manager.
 * @noSelf
 */
export class Events {
  /**
   * The table of global handlers.
   */
  private static globalHandlers = new LuaTable<string, EventHandler[]>();

  /**
   * The table of scene handlers.
   */
  private static sceneHandlers = new LuaTable<string, EventHandler[]>();

  /**
   * Set a new
   * @param handlers The new scene handlers.
   */
  static setSceneHandlers(handlers: LuaTable<string, EventHandler[]>): void {
    Events.sceneHandlers = handlers;
  }

  static getSceneHanndlers(): LuaTable<string, EventHandler[]> {
    return Events.sceneHandlers;
  }

  /**
   * Remove all global handlers.
   */
  static clearGlobalHandlers(): void {
    Events.globalHandlers = new LuaTable<string, EventHandler[]>();
  }

  /**
   * Add a new event handler to the event manager.
   * @param type The type of event that triggers the callback.
   * @param callback The callback function.
   * @param canCancel Can this callback cancel events so callbacks after this one won't be triggered.
   * @param isGlobal Is this a global handler.
   */
  static on<T extends Event>(
    type: EventType<T>,
    callback: (event: T) => void,
    canCancel = true,
    isGlobal = false
  ): void {
    let handlers: LuaTable<string, EventHandler[]> | null = null;
    if (isGlobal) {
      handlers = Events.globalHandlers;
    } else {
      handlers = Events.sceneHandlers;
    }

    if (!handlers) {
      return;
    }

    if (!handlers.has(type.typeName)) {
      handlers.set(type.typeName, []);
    }
    handlers.get(type.typeName).push(new EventHandler(callback, canCancel));
  }

  /**
   * Remove an event handler.
   * @param type The type of event that triggers the callback.
   * @param callback The callback function the handler has.
   * @param isGlobal Is this a global handler.
   */
  static off<T extends Event>(type: EventType<T>, callback: (event: T) => void, isGlobal = false): void {
    let handlers: LuaTable<string, EventHandler[]> | null = null;
    if (isGlobal) {
      handlers = Events.globalHandlers;
    } else {
      handlers = Events.sceneHandlers;
    }

    if (!handlers) {
      return;
    }

    if (handlers.has(type.typeName)) {
      const index = handlers.get(type.typeName).findIndex((value) => {
        return value.callback === callback;
      });

      if (index !== -1) {
        handlers.get(type.typeName).splice(index, 1);
      }
    }
  }

  /**
   * Check if the event manager has a handler.
   * @param type The type of handler.
   * @param isGlobal Global or scene handler.
   * @param callback Callback function to check for. Optional.
   * @returns True if the handler exists.
   */
  static has<T extends Event>(type: EventType<T>, isGlobal = false, callback?: (event: T) => void): boolean {
    let handlers: LuaTable<string, EventHandler[]> | null = null;
    if (isGlobal) {
      handlers = Events.globalHandlers;
    } else {
      handlers = Events.sceneHandlers;
    }

    if (!handlers) {
      return false;
    }

    const typeHandlers = handlers.get(type.typeName);
    if (!typeHandlers) {
      return false;
    }

    if (!callback) {
      return typeHandlers.length > 0;
    } else {
      for (const handler of typeHandlers) {
        if (handler.callback === callback) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Emit an event. Will call `put` on the event automatically at the end of the function.
   * @param event The event to emit.
   */
  static emit(event: Event): void {
    if (Events.globalHandlers.has(event.typeName)) {
      Events.processHandlers(event, Events.globalHandlers.get(event.typeName));
    }

    if (event.canceled) {
      event.put();
      return;
    }

    if (Events.sceneHandlers.has(event.typeName)) {
      Events.processHandlers(event, Events.sceneHandlers.get(event.typeName));
    }

    event.put();
  }

  /**
   * Process an event and send it to the correct handlers.
   * @param event The event to process.
   * @param handlers The handlers to check.
   */
  private static processHandlers(event: Event, handlers: EventHandler[]): void {
    for (const handler of handlers) {
      handler.callback(event);

      if (event.canceled) {
        if (handler.canCancel) {
          break;
        } else {
          event.canceled = false;
        }
      }
    }
  }
}
