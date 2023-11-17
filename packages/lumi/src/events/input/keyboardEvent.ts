import { KeyConstant, Scancode } from 'love.keyboard';
import { Event, EventType } from '../event';

/**
 * Keyboard input event.
 */
export class KeyboardEvent extends Event {
  /**
   * Key pressed type.
   */
  static readonly PRESSED = new EventType(KeyboardEvent, 'lumi_key_pressed');

  /**
   * Key released type.
   */
  static readonly RELEASED = new EventType(KeyboardEvent, 'lumi_key_released');

  /**
   * The key pressed or released.
   */
  key!: KeyConstant | '';

  /**
   * The key scan code. Doesn't take keyboard layout into account.
   */
  scancode!: Scancode | '';

  /**
   * True if the key press was repeated.
   */
  isRepeat?: boolean;

  /**
   * Object pool for keyboard event.
   */
  private static pool: KeyboardEvent[] = [];

  /**
   * Get an event type from the object pool.
   * @param type The event type.
   * @param key he key pressed or released.
   * @param scancode he key scan code.
   * @param isRepeat if the key press was repeated.
   * @returns The event from the pool.
   * @noSelf
   */
  static get<T extends KeyboardEvent>(
    type: EventType<T>,
    key: KeyConstant,
    scancode: Scancode,
    isRepeat?: boolean
  ): KeyboardEvent {
    let event: KeyboardEvent;
    if (KeyboardEvent.pool.length > 0) {
      event = KeyboardEvent.pool.pop()!;
    } else {
      event = new KeyboardEvent();
    }
    event.reset(type.typeName, key, scancode, isRepeat);

    return event;
  }

  /**
   * Puts the event back into the pool.
   */
  override put(): void {
    super.put();
    KeyboardEvent.pool.push(this);
  }

  /**
   * Set new values on an event.
   * @param typeName The event type name.
   * @param key
   * @param scancode
   * @param isRepeat
   */
  private reset(typeName: string, key: KeyConstant, scancode: Scancode, isRepeat?: boolean): void {
    this.typeName = typeName;
    this.key = key;
    this.scancode = scancode;
    this.isRepeat = isRepeat;
  }
}
