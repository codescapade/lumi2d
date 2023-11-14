import { Joystick } from 'love.joystick';
import { JoystickEvent } from '../../../../src/events';

describe('Test events/input/joystickEvent:', () => {
  it('Should get an event from the pool', () => {
    const joystick = {
      getID: (): number => 3,
    };

    const event = JoystickEvent.get(JoystickEvent.BUTTON_PRESSED, joystick as unknown as Joystick, 1, 0.4, 2, 5, 'lu');

    assert.is_equal(JoystickEvent.BUTTON_PRESSED.typeName, event.typeName);
    assert.is_equal(3, event.id);
    assert.is_equal(1, event.axis);
    assert.is_equal(0.4, event.value);
    assert.is_equal(2, event.button);
    assert.is_equal(5, event.hat);
    assert.is_equal('lu', event.direction);
  });
});
