import { KeyConstant, Scancode } from 'love.keyboard';
import { Event, EventType } from '../event';

export class KeyboardEvent extends Event {
  static readonly PRESSED = new EventType(KeyboardEvent, 'lilo_key_pressed');

  key!: KeyConstant;

  scancode!: Scancode;

  isRepeat?: boolean;

  private static pool: KeyboardEvent[] = [];

  static get<T extends KeyboardEvent>(
    type: EventType<T>,
    key: KeyConstant,
    scancode: Scancode,
    isRepeat?: boolean
  ): KeyboardEvent {
    const event = KeyboardEvent.pool.length > 0 ? KeyboardEvent.pool.pop()! : new KeyboardEvent();
    event.reset(type.typeName, key, scancode, isRepeat);

    return event;
  }

  static clearPool(): void {
    while (KeyboardEvent.pool.length > 0) {
      KeyboardEvent.pool.pop();
    }
  }

  override put(): void {
    super.put();
    KeyboardEvent.pool.push(this);
  }

  private reset(typeName: string, key: KeyConstant, scancode: Scancode, isRepeat?: boolean): void {
    this.typeName = typeName;
    this.key = key;
    this.scancode = scancode;
    this.isRepeat = isRepeat;
  }
}
