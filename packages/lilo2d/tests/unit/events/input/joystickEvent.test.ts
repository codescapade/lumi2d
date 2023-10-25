import { Joystick } from 'love.joystick';
import { JoystickEvent } from '../../../../src/events';

describe('Test events/input/joystickEvent:', () => {
  it('Should get an event from the pool', () => {
    const joystick = {
      getID: (): number => 3,
    };

    const event = JoystickEvent.get(JoystickEvent.BUTTON_PRESSED, joystick as unknown as Joystick, 1, 0.4, 2, 5, 'lu');

    assert.is_equal(event.typeName, JoystickEvent.BUTTON_PRESSED.typeName);
    assert.is_equal(event.id, 3);
    assert.is_equal(event.axis, 1);
    assert.is_equal(event.value, 0.4);
    assert.is_equal(event.button, 2);
    assert.is_equal(event.hat, 5);
    assert.is_equal(event.direction, 'lu');
  });
});
