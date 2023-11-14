import { Joystick, JoystickHat } from 'love.joystick';
import { Event, EventType } from '../event';

/**
 * Joystick input event.
 */
export class JoystickEvent extends Event {
  /**
   * Joystick connected type.
   */
  static readonly CONNECTED = new EventType(JoystickEvent, 'lilo_joystick_connected');

  /**
   * Joystick disconnected type.
   */
  static readonly DISCONNECTED = new EventType(JoystickEvent, 'lilo_joystick_disconnected');

  /**
   * Joystick axis changed type.
   */
  static readonly AXIS_CHANGED = new EventType(JoystickEvent, 'lilo_joystick_axis_changed');

  /**
   * Joystick hat changed type.
   */
  static readonly HAT_CHANGED = new EventType(JoystickEvent, 'lilo_joystick_hat_changed');

  /**
   * Joystick button pressed type.
   */
  static readonly BUTTON_PRESSED = new EventType(JoystickEvent, 'lilo_joystick_button_pressed');

  /**
   * Joystick button released type.
   */
  static readonly BUTTON_RELEASED = new EventType(JoystickEvent, 'lilo_joystick_button_released');

  /**
   * The joystick button.
   */
  joystick!: Joystick;

  /**
   * The joystick id.
   */
  id!: number;

  /**
   * The axis that changed. Used in the AXIS_CHANGED event.
   */
  axis?: number;

  /**
   * The axis new value. Used in the AXIS_CHANGED event.
   */
  value?: number;

  /**
   * The button that was pressed/released. Used in the BUTTON_PRESSED/BUTTON_RELEASED events.
   */
  button?: number;

  /**
   * The hat that changed. Used in the HAT_CHANGED event.
   */
  hat?: number;

  /**
   * The new hat direction. Used in the HAT_CHANGED event.
   */
  direction?: JoystickHat;

  /**
   * Object pool for event reuse.
   */
  private static pool: JoystickEvent[] = [];

  /**
   * Get a joystick event from the pool.
   * @param type The type of event.
   * @param joystick The joystick object.
   * @param axis The axis that changed.
   * @param value The new axis value.
   * @param button The button that was pressed/released.
   * @param hat The hat that changed.
   * @param direction The new hat direction.
   * @returns The event.
   */
  static get<T extends JoystickEvent>(
    type: EventType<T>,
    joystick: Joystick,
    axis?: number,
    value?: number,
    button?: number,
    hat?: number,
    direction?: JoystickHat
  ): JoystickEvent {
    let event: JoystickEvent;
    if (JoystickEvent.pool.length > 0) {
      event = JoystickEvent.pool.pop()!;
    } else {
      event = new JoystickEvent();
    }
    event.reset(type.typeName, joystick, axis, value, button, hat, direction);

    return event;
  }

  /**
   * Puts the event back into the pool.
   */
  override put(): void {
    super.put();
    JoystickEvent.pool.push(this);
  }

  /**
   * Set new values to the event fields.
   * @param typeName The type of event.
   * @param joystick The joystick object.
   * @param axis The axis that changed.
   * @param value The new axis value.
   * @param button The button that was pressed/released.
   * @param hat The hat that changed.
   * @param direction The new hat direction.
   */
  private reset(
    typeName: string,
    joystick: Joystick,
    axis?: number,
    value?: number,
    button?: number,
    hat?: number,
    direction?: JoystickHat
  ): void {
    this.typeName = typeName;
    this.joystick = joystick;
    const [id] = joystick.getID();
    this.id = id;
    this.axis = axis;
    this.value = value;
    this.button = button;
    this.hat = hat;
    this.direction = direction;
  }
}
