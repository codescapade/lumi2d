import { GamepadAxis, GamepadButton, Joystick } from 'love.joystick';
import { Event, EventType } from '../event';

/**
 * Gamepad input event.
 */
export class GamepadEvent extends Event {
  /**
   * Gamepad connected type.
   */
  static readonly CONNECTED = new EventType(GamepadEvent, 'lilo_gamepad_connected');

  /**
   * Gamepad disconnected type.
   */
  static readonly DISCONNECTED = new EventType(GamepadEvent, 'lilo_gamepad_disconnected');

  /**
   * Gamepad axis (joysticks/triggers) changed type.
   */
  static readonly AXIS_CHANGED = new EventType(GamepadEvent, 'lilo_gamepad_axis_changed');

  /**
   * Gamepad button pressed type.
   */
  static readonly BUTTON_PRESSED = new EventType(GamepadEvent, 'lilo_gamepad_button_pressed');

  /**
   * Gamepad button released type.
   */
  static readonly BUTTON_RELEASED = new EventType(GamepadEvent, 'lilo_gamepad_button_released');

  /**
   * The gamepad object.
   */
  gamepad!: Joystick;

  /**
   * The gamepad id.
   */
  id!: number;

  /**
   * The axis that changed. Used in the AXIS_CHANGED event.
   */
  axis?: GamepadAxis;

  /**
   * The axis new value. Used in the AXIS_CHANGED event.
   */
  value?: number;

  /**
   * The button that was pressed/released. Used in the BUTTON_PRESSED/BUTTON_RELEASED events.
   */
  button?: GamepadButton;

  /**
   * Object pool for event reuse.
   */
  private static pool: GamepadEvent[] = [];

  /**
   * Get a gamepad event from the pool.
   * @param type The type of event.
   * @param gamepad The gamepad object.
   * @param axis The axis that changed.
   * @param value The new axis value.
   * @param button The button that was pressed/released.
   * @returns The event.
   */
  static get<T extends GamepadEvent>(
    type: EventType<T>,
    gamepad: Joystick,
    axis?: GamepadAxis,
    value?: number,
    button?: GamepadButton
  ): GamepadEvent {
    let event: GamepadEvent;
    if (GamepadEvent.pool.length > 0) {
      event = GamepadEvent.pool.pop()!;
    } else {
      event = new GamepadEvent();
    }
    event.reset(type.typeName, gamepad, axis, value, button);

    return event;
  }

  /**
   * Remove all objects from the pool.
   */
  static clearPool(): void {
    while (GamepadEvent.pool.length > 0) {
      GamepadEvent.pool.pop();
    }
  }

  /**
   * Puts the event back into the pool.
   */
  override put(): void {
    super.put();
    GamepadEvent.pool.push(this);
  }

  /**
   * Set new values to the event fields.
   * @param typeName The type of event.
   * @param gamepad The gamepad object.
   * @param axis The axis that changes.
   * @param value The new axis value.
   * @param button The button that was pressed/released.
   */
  private reset(typeName: string, gamepad: Joystick, axis?: GamepadAxis, value?: number, button?: GamepadButton): void {
    this.typeName = typeName;
    this.gamepad = gamepad;
    const [id] = gamepad.getID();
    this.id = id;
    this.axis = axis;
    this.value = value;
    this.button = button;
  }
}
