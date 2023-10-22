import { Event, EventType } from './event';

type EventCallback = (event: any) => void;

export class Handler {
  callback: EventCallback;
  canCancel: boolean;

  constructor(callback: EventCallback, canCancel: boolean) {
    this.callback = callback;
    this.canCancel = canCancel;
  }
}

/**
 * @noSelf
 */
export class Events {
  private static globalHandlers = new LuaTable<string, Handler[]>();

  private static sceneHandlers = new LuaTable<string, Handler[]>();

  static setSceneHandlers(handlers: LuaTable<string, Handler[]>): void {
    Events.sceneHandlers = handlers;
  }

  static clearGlobalHandlers(): void {
    Events.globalHandlers = new LuaTable<string, Handler[]>();
  }

  static on<T extends Event>(
    type: EventType<T>,
    callback: (event: T) => void,
    canCancel = true,
    isGlobal = false
  ): void {
    let handlers: LuaTable<string, Handler[]> | null = null;
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
    handlers.get(type.typeName).push(new Handler(callback, canCancel));
  }

  static off<T extends Event>(type: EventType<T>, callback: (event: T) => void, isGlobal = false): void {
    let handlers: LuaTable<string, Handler[]> | null = null;
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

  static has<T extends Event>(type: EventType<T>, isGlobal = false, callback?: (event: T) => void): boolean {
    let handlers: LuaTable<string, Handler[]> | null = null;
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

  private static processHandlers(event: Event, handlers: Handler[]): void {
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
